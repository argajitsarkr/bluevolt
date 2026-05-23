import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import type { Product } from "@/types";
import AddToCartButton from "./AddToCartButton";
import { inr, discountPct } from "@/lib/format";

export const dynamic = "force-dynamic";

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
    <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
      <div className="aspect-square card overflow-hidden bg-ink/5 flex items-center justify-center">
        {p.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-ink/30">No image</span>
        )}
      </div>
      <div>
        <div className="text-xs font-mono uppercase text-ink/60">{p.brand || p.sku}</div>
        <h1 className="text-3xl font-bold mt-1">{p.name}</h1>
        <div className="text-sm text-ink/60 mt-1">{p.pack_size}</div>
        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-3xl font-bold text-brand">{inr(p.our_price_paise)}</span>
          {p.mrp_paise > p.our_price_paise && (
            <>
              <span className="text-ink/40 line-through">{inr(p.mrp_paise)}</span>
              {off > 0 && <span className="chip bg-green-100 text-green-800">-{off}% off</span>}
            </>
          )}
        </div>
        <p className="mt-6 text-ink/80 whitespace-pre-wrap">{p.description || "No description provided."}</p>
        <div className="mt-8">
          <AddToCartButton product={p} />
        </div>
      </div>
    </div>
  );
}
