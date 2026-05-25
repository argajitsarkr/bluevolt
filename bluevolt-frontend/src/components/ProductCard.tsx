"use client";
import Link from "next/link";
import type { Product } from "@/types";
import { inr, discountPct } from "@/lib/format";
import { useCart } from "./CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addProduct } = useCart();
  const off = discountPct(product.mrp_paise, product.our_price_paise);
  return (
    <div className="p-5 flex flex-col h-full hover:bg-ink/[0.02] transition group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="aspect-square bg-ink/[0.03] overflow-hidden mb-4 flex items-center justify-center">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-3" />
          ) : (
            <span className="eyebrow text-ink/30">No image</span>
          )}
        </div>
        <div className="flex items-center justify-between mb-1">
          <div className="eyebrow text-ink/50">{product.brand || product.sku || " "}</div>
          {product.in_stock ? (
            <span className="text-[10px] mono uppercase tracking-[0.12em] text-green-700">In stock</span>
          ) : (
            <span className="text-[10px] mono uppercase tracking-[0.12em] text-red-600">Out</span>
          )}
        </div>
        <div className="font-medium leading-snug line-clamp-2 min-h-[3em] group-hover:text-brand transition">
          {product.name}
        </div>
        {product.pack_size && (
          <div className="mt-1">
            <span className="inline-block mono text-[11px] uppercase tracking-[0.1em] border border-ink/20 px-1.5 py-0.5">
              {product.pack_size}
            </span>
          </div>
        )}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-bold text-brand">{inr(product.our_price_paise)}</span>
          {product.mrp_paise > product.our_price_paise && (
            <>
              <span className="text-xs text-ink/40 line-through">{inr(product.mrp_paise)}</span>
              {off > 0 && <span className="chip bg-green-100 text-green-800 text-[10px] px-1.5 py-0.5">-{off}%</span>}
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
