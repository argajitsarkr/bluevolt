"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import type { Order } from "@/types";
import { inr } from "@/lib/format";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  fulfilled: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const sp = useSearchParams();
  const placed = sp.get("placed") === "1";
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = (session?.user as any)?.backendToken;
    if (!token) return;
    api<Order[]>("/api/v1/orders/me", { token })
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Your orders</h1>
      {placed && (
        <div className="mt-4 card p-4 bg-green-50 border-green-200 text-green-900">
          Order placed. We'll call you shortly to confirm.
        </div>
      )}
      {loading ? (
        <div className="mt-6 text-ink/60">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="mt-8 card p-8 text-center text-ink/60">No orders yet.</div>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="card p-4">
              <div className="flex items-center gap-3">
                <div className="font-mono text-sm text-ink/60">#{o.id}</div>
                <span className={`chip px-2 py-0.5 ${STATUS_COLORS[o.status] || "bg-ink/5"}`}>{o.status}</span>
                <div className="ml-auto text-sm text-ink/60">{new Date(o.created_at).toLocaleString()}</div>
              </div>
              <ul className="mt-3 text-sm space-y-1">
                {o.items.map((it) => (
                  <li key={it.id} className="text-ink/80">
                    {it.quantity} × {it.name_snapshot || (it.kind === "custom" ? `Custom: ${it.custom_text}` : "Item")}
                    {it.unit_price_paise != null && (
                      <span className="text-ink/50"> - {inr(it.unit_price_paise)}/ea</span>
                    )}
                  </li>
                ))}
              </ul>
              {o.notes && <div className="mt-2 text-sm text-ink/60 italic">Notes: {o.notes}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
