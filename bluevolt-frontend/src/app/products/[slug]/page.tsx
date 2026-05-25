import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import type { Product } from "@/types";
import ProductActions from "./ProductActions";
import { inr, discountPct } from "@/lib/format";

export const dynamic = "force-dynamic";

const DOC_TILES = [
  { key: "spec_sheet_url", code: "TD", label: "Technical Data Sheet" },
  { key: "safety_sheet_url", code: "SDS", label: "Safety Data Sheet" },
  { key: "usage_url", code: "EIFU", label: "Electronic Instructions For Use" },
  { key: "coa_url", code: "COA", label: "Certificate Of Analysis" },
] as const;

export default async function ProductDetail({ params }: { params: { slug: string } }) {
  let p: Product | null = null;
  try {
    p = await api<Product>(`/api/v1/products/${params.slug}`);
  } catch {
    notFound();
  }
  if (!p) notFound();
  const off = discountPct(p.mrp_paise, p.our_price_paise);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs mono uppercase tracking-[0.14em] text-ink/50 mb-6">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-ink">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-brand">{p.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="border border-ink/10 bg-ink/[0.02] aspect-square flex items-center justify-center">
          {p.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.image_url} alt={p.name} className="w-full h-full object-contain p-6" />
          ) : (
            <span className="eyebrow">No image</span>
          )}
        </div>

        {/* Buy panel */}
        <div>
          <div className="eyebrow mb-2">{p.brand || "Blue Volt Scientific"}</div>
          <h1 className="display text-3xl md:text-4xl">{p.name}</h1>

          {p.sku && (
            <div className="mt-4 inline-flex items-center border border-ink/20 px-3 py-1.5">
              <span className="eyebrow text-ink/50 mr-2">SKU:</span>
              <span className="mono text-sm font-medium">{p.sku}</span>
            </div>
          )}

          <div className="mt-5 flex items-center gap-2 text-sm">
            <span className="eyebrow text-ink/50">Availability:</span>
            {p.in_stock ? (
              <span className="inline-flex items-center gap-1.5 text-green-700 font-medium">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.59 7.7 9.3a1 1 0 10-1.4 1.4l2 2a1 1 0 001.4 0l4-4z" clipRule="evenodd"/></svg>
                In Stock
              </span>
            ) : (
              <span className="text-red-600 font-medium">Out of stock</span>
            )}
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-4xl font-bold text-brand">{inr(p.our_price_paise)}</span>
            {p.mrp_paise > p.our_price_paise && (
              <>
                <span className="text-lg text-ink/40 line-through">{inr(p.mrp_paise)}</span>
                {off > 0 && (
                  <span className="chip bg-green-100 text-green-800 px-2 py-1">-{off}% off</span>
                )}
              </>
            )}
          </div>
          <div className="mt-1 text-xs text-ink/50">Inclusive of all taxes - confirmed on call</div>

          {p.pack_size && (
            <div className="mt-7">
              <div className="eyebrow text-ink/60 mb-2">Pack size</div>
              <span className="inline-flex items-center bg-brand text-white px-4 py-2 mono text-sm font-medium">
                {p.pack_size}
              </span>
            </div>
          )}

          <div className="mt-7">
            <ProductActions product={p} />
          </div>

          {p.description && (
            <p className="mt-8 text-ink/80 leading-relaxed whitespace-pre-wrap">
              {p.description}
            </p>
          )}

          {/* Document tiles - only those with a URL */}
          {DOC_TILES.some((d) => (p as any)[d.key]) && (
            <div className="mt-10 grid grid-cols-2 gap-3">
              {DOC_TILES.map((d) => {
                const url = (p as any)[d.key];
                if (!url) return null;
                return (
                  <a
                    key={d.code}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-ink/15 p-3 flex items-center gap-3 hover:border-ink hover:bg-ink hover:text-white transition group"
                  >
                    <span className="chip border border-current px-2 py-1 mono">[{d.code}]</span>
                    <span className="text-sm">{d.label}</span>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
