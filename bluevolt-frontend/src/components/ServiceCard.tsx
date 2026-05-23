"use client";
import Link from "next/link";
import type { Service } from "@/types";
import { inr } from "@/lib/format";
import { useCart } from "./CartContext";

export default function ServiceCard({ service }: { service: Service }) {
  const { addService } = useCart();
  return (
    <div className="p-6 flex flex-col h-full hover:bg-ink/[0.02] transition">
      <Link href={`/services/${service.slug}`} className="block">
        <div className="font-medium">{service.name}</div>
        <p className="text-sm text-ink/70 mt-1 line-clamp-3">{service.description}</p>
        <div className="mt-3 flex items-center gap-3 text-sm">
          <span className="font-semibold text-brand">{inr(service.indicative_price_paise)}</span>
          {service.turnaround_days != null && (
            <span className="chip bg-ink/5">~{service.turnaround_days} days</span>
          )}
        </div>
      </Link>
      <button onClick={() => addService(service, 1)} className="btn-outline mt-3 w-full text-sm">
        Request this service
      </button>
    </div>
  );
}
