"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Order } from "@/types";

const STATUSES = ["pending", "confirmed", "fulfilled", "cancelled"] as const;

export default function AdminOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const token = (session?.user as any)?.backendToken;
    if (!token) return;
    setLoading(true);
    const qs = status ? `?status=${status}` : "";
    const data = await api<Order[]>(`/api/v1/admin/orders${qs}`, { token });
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    if (session) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status]);

  const updateStatus = async (id: number, s: string) => {
    const token = (session?.user as any)?.backendToken;
    await api(`/api/v1/admin/orders/${id}`, {
      method: "PATCH",
      token,
      body: JSON.stringify({ status: s }),
    });
    load();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-baseline justify-between">
        <h1 className="text-3xl font-bold">Orders</h1>
        <Link href="/admin" className="text-sm text-ink/60 hover:underline">← Back to admin</Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setStatus("")}
          className={`chip px-3 py-1 border ${status === "" ? "bg-brand text-white border-brand" : "border-ink/15 hover:bg-ink/5"}`}
        >
          All
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`chip px-3 py-1 border ${status === s ? "bg-brand text-white border-brand" : "border-ink/15 hover:bg-ink/5"}`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-6 text-ink/60">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="mt-8 card p-8 text-center text-ink/60">No orders.</div>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="card p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="font-mono text-sm text-ink/60">#{o.id}</div>
                <div className="font-medium">{o.contact_name || "(no name)"}</div>
                <a href={`tel:${o.contact_phone}`} className="text-brand font-medium hover:underline">
                  {o.contact_phone || "(no phone)"}
                </a>
                <span className="text-xs text-ink/60">{o.user_email}</span>
                <div className="ml-auto text-xs text-ink/60">{new Date(o.created_at).toLocaleString()}</div>
              </div>
              <ul className="mt-3 text-sm space-y-1">
                {o.items.map((it) => (
                  <li key={it.id} className="text-ink/80">
                    {it.quantity} × {it.name_snapshot || (it.kind === "custom" ? `Custom: ${it.custom_text}` : "Item")}
                  </li>
                ))}
              </ul>
              {o.notes && <div className="mt-2 text-sm text-ink/60 italic">Notes: {o.notes}</div>}
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-sm text-ink/60 mr-2">Status:</span>
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(o.id, s)}
                    className={`chip px-2 py-1 text-xs border ${o.status === s ? "bg-ink text-white border-ink" : "border-ink/15 hover:bg-ink/5"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
