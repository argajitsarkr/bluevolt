import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import { api } from "@/lib/api";
import type { Service, Category } from "@/types";

export const dynamic = "force-dynamic";

export default async function ServicesPage({ searchParams }: { searchParams: { category?: string; q?: string } }) {
  const cats = await api<Category[]>("/api/v1/categories?kind=service").catch(() => []);
  const params = new URLSearchParams();
  if (searchParams.category) {
    const cat = cats.find((c) => c.slug === searchParams.category);
    if (cat) params.set("category_id", String(cat.id));
  }
  if (searchParams.q) params.set("search", searchParams.q);
  const services = await api<Service[]>(`/api/v1/services?${params.toString()}`).catch(() => []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Services</h1>
      <p className="text-ink/70 mt-1">Instrument repair, calibration, AMC, custom servicing.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/services"
          className={`chip border ${!searchParams.category ? "bg-brand text-white border-brand" : "border-ink/15 hover:bg-ink/5"} px-3 py-1`}
        >
          All
        </Link>
        {cats.map((c) => (
          <Link
            key={c.id}
            href={`/services?category=${c.slug}`}
            className={`chip border ${searchParams.category === c.slug ? "bg-brand text-white border-brand" : "border-ink/15 hover:bg-ink/5"} px-3 py-1`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {services.length === 0 ? (
        <div className="mt-10 card p-10 text-center text-ink/60">
          No services listed yet. Add from the admin panel.
        </div>
      ) : (
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      )}
    </div>
  );
}
