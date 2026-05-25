"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import QtyStepper from "@/components/QtyStepper";
import type { Product } from "@/types";

export default function ProductActions({ product }: { product: Product }) {
  const { addProduct, addCustom } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [flash, setFlash] = useState<string | null>(null);

  const enquire = () => {
    addCustom(
      `Enquiry for ${product.name}${product.sku ? ` (SKU ${product.sku})` : ""}${product.pack_size ? ` - pack ${product.pack_size}` : ""}. Please call to confirm pricing/availability.`,
      qty
    );
    router.push("/cart");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <QtyStepper value={qty} onChange={setQty} />
        <button
          disabled={!product.in_stock}
          onClick={() => {
            addProduct(product, qty);
            setFlash("Added to cart");
            setTimeout(() => setFlash(null), 1500);
          }}
          className="btn-primary flex-1 min-w-[180px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {product.in_stock ? (flash || "Add to cart") : "Out of stock"}
        </button>
        <button onClick={enquire} className="btn-outline">
          Enquire
        </button>
      </div>
      <div className="text-xs text-ink/50">
        Free helpline before order - we call before dispatch. No online payment.
      </div>
    </div>
  );
}
