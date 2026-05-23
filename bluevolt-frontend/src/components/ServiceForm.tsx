"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";
import type { Category, Service } from "@/types";

export default function ServiceForm({ initial }: { initial?: Service }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [cats, setCats] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: initial?.name || "",
    description: initial?.description || "",
    category_id: initial?.category_id || null,
    indicative_price_rupees: initial?.indicative_price_paise != null ? initial.indicative_price_paise / 100 : "",
    turnaround_days: initial?.turnaround_days ?? "",
    image_url: initial?.image_url || "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api<Category[]>("/api/v1/categories?kind=service").then(setCats).catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const token = (session?.user as any)?.backendToken;
      const body = {
        name: form.name,
        description: form.description,
        category_id: form.category_id ? Number(form.category_id) : null,
        indicative_price_paise:
          form.indicative_price_rupees === "" || form.indicative_price_rupees === null
            ? null
            : Math.round(Number(form.indicative_price_rupees) * 100),
        turnaround_days: form.turnaround_days === "" ? null : Number(form.turnaround_days),
        image_url: form.image_url,
      };
      if (initial) {
        await api(`/api/v1/admin/services/${initial.id}`, { method: "PUT", token, body: JSON.stringify(body) });
      } else {
        await api("/api/v1/admin/services", { method: "POST", token, body: JSON.stringify(body) });
      }
      router.push("/admin/services");
      router.refresh();
    } catch (e: any) {
      setErr(e.message || "Failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="label">Name</label>
        <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      </div>
      <div>
        <label className="label">Category</label>
        <select
          className="input"
          value={form.category_id ?? ""}
          onChange={(e) => setForm({ ...form, category_id: e.target.value ? Number(e.target.value) : null })}
        >
          <option value="">(none)</option>
          {cats.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Indicative price (₹, optional)</label>
          <input
            type="number"
            min={0}
            className="input"
            value={form.indicative_price_rupees}
            onChange={(e) => setForm({ ...form, indicative_price_rupees: e.target.value as any })}
          />
        </div>
        <div>
          <label className="label">Turnaround (days, optional)</label>
          <input
            type="number"
            min={0}
            className="input"
            value={form.turnaround_days as any}
            onChange={(e) => setForm({ ...form, turnaround_days: e.target.value as any })}
          />
        </div>
      </div>
      <div>
        <label className="label">Image URL</label>
        <input className="input" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input min-h-[120px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      {err && <div className="text-sm text-red-600">{err}</div>}
      <button className="btn-primary" disabled={busy}>{busy ? "Saving..." : initial ? "Update service" : "Create service"}</button>
    </form>
  );
}
