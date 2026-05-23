"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/components/CartContext";
import { api } from "@/lib/api";

export default function CheckoutPage() {
  const { lines, clear } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user as any;

  const [name, setName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    setErr(null);
    if (!phone.trim()) { setErr("Phone number is required."); return; }
    if (lines.length === 0) { setErr("Cart is empty."); return; }
    setSubmitting(true);
    try {
      const items = lines.map((l) => {
        if (l.kind === "product") return { kind: "product", product_id: l.product.id, quantity: l.quantity };
        if (l.kind === "service") return { kind: "service", service_id: l.service.id, quantity: l.quantity };
        return { kind: "custom", custom_text: l.text, quantity: l.quantity };
      });
      await api("/api/v1/orders", {
        method: "POST",
        token: user?.backendToken,
        body: JSON.stringify({ contact_name: name, contact_phone: phone, notes, items }),
      });
      clear();
      router.push("/dashboard?placed=1");
    } catch (e: any) {
      setErr(e.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Place order</h1>
      <p className="text-ink/70 mt-1">We'll call this number to confirm your order. No payment is taken online.</p>

      <div className="mt-8 space-y-4">
        <div>
          <label className="label">Your name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. Asha Kumari" />
        </div>
        <div>
          <label className="label">Phone number (required)</label>
          <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9xxxxxxxxx" />
        </div>
        <div>
          <label className="label">Notes (optional)</label>
          <textarea
            className="input min-h-[100px]"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Delivery address, preferred call time, lab name, etc."
          />
        </div>

        <div className="card p-4 text-sm">
          <div className="font-medium mb-2">{lines.length} item(s) in cart</div>
          <ul className="text-ink/70 list-disc list-inside space-y-1">
            {lines.map((l, i) => (
              <li key={i}>
                {l.quantity} ×{" "}
                {l.kind === "product" ? l.product.name : l.kind === "service" ? l.service.name : `Custom: ${l.text.slice(0, 60)}`}
              </li>
            ))}
          </ul>
        </div>

        {err && <div className="text-sm text-red-600">{err}</div>}

        <button onClick={submit} disabled={submitting} className="btn-primary w-full">
          {submitting ? "Placing order..." : "Place order"}
        </button>
      </div>
    </div>
  );
}
