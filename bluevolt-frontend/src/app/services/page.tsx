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
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="eyebrow mb-3">Catalog / Services</div>
      <h1 className="display text-5xl md:text-7xl">Servicing</h1>
      <p className="mt-5 text-ink/70 text-lg max-w-2xl">
        Repair, AMC, calibration, custom. Pick one and add it to your cart - we call to scope.
      </p>

      <div className="mt-12 flex flex-wrap gap-px bg-ink/15 border border-ink/15">
        <Link
          href="/services"
          className={`px-4 py-2 mono text-[11px] uppercase tracking-[0.14em] ${!searchParams.category ? "bg-ink text-white" : "bg-white hover:bg-ink/5"}`}
        >
          All
        </Link>
        {cats.map((c) => (
          <Link
            key={c.id}
            href={`/services?category=${c.slug}`}
            className={`px-4 py-2 mono text-[11px] uppercase tracking-[0.14em] ${searchParams.category === c.slug ? "bg-ink text-white" : "bg-white hover:bg-ink/5"}`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {services.length === 0 ? (
        <div className="mt-16 border border-ink/15 p-16 text-center">
          <div className="eyebrow mb-3">Empty</div>
          <div className="text-xl">No services listed yet.</div>
          <p className="mt-2 text-ink/60">Add from the admin panel.</p>
        </div>
      ) : (
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/15 border border-ink/15">
          {services.map((s) => (
            <div key={s.id} className="bg-white">
              <ServiceCard service={s} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
