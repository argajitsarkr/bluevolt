"use client";
import Link from "next/link";
import type { Product } from "@/types";
import { inr, discountPct } from "@/lib/format";
import { useCart } from "./CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addProduct } = useCart();
  const off = discountPct(product.mrp_paise, product.our_price_paise);
  return (
    <div className="card p-4 flex flex-col">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="aspect-square bg-ink/5 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-ink/30 text-sm">No image</span>
          )}
        </div>
        <div className="text-xs text-ink/60 mb-1">{product.brand || product.sku || " "}</div>
        <div className="font-medium line-clamp-2 min-h-[3em]">{product.name}</div>
        <div className="text-xs text-ink/60 mt-0.5">{product.pack_size}</div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-bold text-brand">{inr(product.our_price_paise)}</span>
          {product.mrp_paise > product.our_price_paise && (
            <>
              <span className="text-xs text-ink/40 line-through">{inr(product.mrp_paise)}</span>
              {off > 0 && <span className="chip bg-green-100 text-green-800">-{off}%</span>}
            </>
          )}
        </div>
      </Link>
      <button
        onClick={() => addProduct(product, 1)}
        disabled={!product.in_stock}
        className="btn-primary mt-3 w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {product.in_stock ? "Add to cart" : "Out of stock"}
      </button>
    </div>
  );
}
