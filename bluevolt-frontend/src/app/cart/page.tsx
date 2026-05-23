"use client";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import CustomQueryForm from "@/components/CustomQueryForm";
import { inr } from "@/lib/format";

export default function CartPage() {
  const { lines, setQuantity, remove, clear } = useCart();
  const subtotal = lines.reduce((s, l) => {
    if (l.kind === "product") return s + l.product.our_price_paise * l.quantity;
    if (l.kind === "service" && l.service.indicative_price_paise) return s + l.service.indicative_price_paise * l.quantity;
    return s;
  }, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Your cart</h1>
      <p className="text-ink/70 mt-1">No money is collected here. Submit your order - we'll call to confirm.</p>

      {lines.length === 0 ? (
        <div className="mt-8 card p-8 text-center text-ink/60">
          Your cart is empty. <Link href="/products" className="text-brand underline">Browse products</Link> or add a custom request below.
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {lines.map((line, i) => {
            let title = "", sub = "", price: number | null = null, slug: string | null = null;
            if (line.kind === "product") {
              title = line.product.name;
              sub = `${line.product.brand} - ${line.product.pack_size}`;
              price = line.product.our_price_paise;
              slug = `/products/${line.product.slug}`;
            } else if (line.kind === "service") {
              title = line.service.name;
              sub = "Service request";
              price = line.service.indicative_price_paise;
              slug = `/services/${line.service.slug}`;
            } else {
              title = "Custom request";
              sub = line.text;
            }
            return (
              <div key={i} className="card p-4 flex items-start gap-4">
                <div className="flex-1">
                  {slug ? (
                    <Link href={slug} className="font-medium hover:text-brand">{title}</Link>
                  ) : (
                    <div className="font-medium">{title}</div>
                  )}
                  <div className="text-sm text-ink/60 mt-0.5 whitespace-pre-wrap">{sub}</div>
                </div>
                <input
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(e) => setQuantity(i, Math.max(1, parseInt(e.target.value || "1", 10)))}
                  className="input w-20"
                />
                <div className="w-28 text-right font-semibold">
                  {price != null ? inr(price * line.quantity) : <span className="text-ink/50 text-sm">On request</span>}
                </div>
                <button onClick={() => remove(i)} className="text-sm text-red-600 hover:underline">Remove</button>
              </div>
            );
          })}

          <div className="card p-4 flex items-center justify-between">
            <div className="text-sm text-ink/70">
              Subtotal (catalog items only - custom requests priced on call)
            </div>
            <div className="text-xl font-bold">{inr(subtotal)}</div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button onClick={clear} className="text-sm text-ink/60 hover:underline">Clear cart</button>
            <Link href="/checkout" className="btn-primary">Place order</Link>
          </div>
        </div>
      )}

      <div className="mt-10">
        <CustomQueryForm />
      </div>
    </div>
  );
}
