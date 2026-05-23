"use client";
import { useState } from "react";
import { useCart } from "@/components/CartContext";
import type { Product } from "@/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addProduct } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  return (
    <div className="flex items-center gap-3">
      <input
        type="number"
        min={1}
        value={qty}
        onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || "1", 10)))}
        className="input w-24"
      />
      <button
        disabled={!product.in_stock}
        onClick={() => {
          addProduct(product, qty);
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
        className="btn-primary disabled:opacity-50"
      >
        {product.in_stock ? (added ? "Added to cart" : "Add to cart") : "Out of stock"}
      </button>
    </div>
  );
}
