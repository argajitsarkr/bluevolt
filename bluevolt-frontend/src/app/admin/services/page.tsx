"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Service } from "@/types";
import { inr } from "@/lib/format";

export default function AdminServicesPage() {
  const { data: session } = useSession();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await api<Service[]>("/api/v1/services?limit=200").catch(() => []);
    setServices(data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const del = async (id: number) => {
    if (!confirm("Delete this service?")) return;
    const token = (session?.user as any)?.backendToken;
    await api(`/api/v1/admin/services/${id}`, { method: "DELETE", token });
    load();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-baseline justify-between">
        <h1 className="text-3xl font-bold">Services</h1>
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-sm text-ink/60 hover:underline">← Admin</Link>
          <Link href="/admin/services/new" className="btn-primary text-sm">+ Add service</Link>
        </div>
      </div>
      {loading ? (
        <div className="mt-6 text-ink/60">Loading...</div>
      ) : (
        <div className="mt-6 card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left bg-ink/5 text-ink/70">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Indicative price</th>
                <th className="p-3">Turnaround</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="border-t border-ink/10">
                  <td className="p-3 font-medium">{s.name}</td>
                  <td className="p-3">{inr(s.indicative_price_paise)}</td>
                  <td className="p-3">{s.turnaround_days != null ? `${s.turnaround_days} days` : "-"}</td>
                  <td className="p-3 text-right space-x-3">
                    <Link href={`/admin/services/${s.id}/edit`} className="text-brand hover:underline">Edit</Link>
                    <button onClick={() => del(s.id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr><td colSpan={4} className="p-6 text-center text-ink/60">No services yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
