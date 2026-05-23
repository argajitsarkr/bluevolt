import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import type { Service } from "@/types";
import AddServiceButton from "./AddServiceButton";
import { inr } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ServiceDetail({ params }: { params: { slug: string } }) {
  let s: Service | null = null;
  try {
    s = await api<Service>(`/api/v1/services/${params.slug}`);
  } catch {
    notFound();
  }
  if (!s) notFound();
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-xs font-mono uppercase text-ink/60">Service</div>
      <h1 className="text-3xl font-bold mt-1">{s.name}</h1>
      <div className="mt-3 flex items-center gap-3 text-sm">
        <span className="text-xl font-semibold text-brand">{inr(s.indicative_price_paise)}</span>
        {s.turnaround_days != null && <span className="chip bg-ink/5">~{s.turnaround_days} days</span>}
      </div>
      <p className="mt-6 text-ink/80 whitespace-pre-wrap">{s.description || "Describe your instrument / requirement when placing the request."}</p>
      <div className="mt-8">
        <AddServiceButton service={s} />
      </div>
    </div>
  );
}
