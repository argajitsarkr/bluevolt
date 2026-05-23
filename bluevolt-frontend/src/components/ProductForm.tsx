"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";
import type { Category, Product } from "@/types";

export default function ProductForm({ initial }: { initial?: Product }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [cats, setCats] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: initial?.name || "",
    description: initial?.description || "",
    category_id: initial?.category_id || null,
    brand: initial?.brand || "",
    sku: initial?.sku || "",
    pack_size: initial?.pack_size || "",
    mrp_rupees: initial ? initial.mrp_paise / 100 : 0,
    our_price_rupees: initial ? initial.our_price_paise / 100 : 0,
    in_stock: initial?.in_stock ?? true,
    image_url: initial?.image_url || "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api<Category[]>("/api/v1/categories?kind=product").then(setCats).catch(() => {});
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
        brand: form.brand,
        sku: form.sku,
        pack_size: form.pack_size,
        mrp_paise: Math.round(form.mrp_rupees * 100),
        our_price_paise: Math.round(form.our_price_rupees * 100),
        in_stock: form.in_stock,
        image_url: form.image_url,
      };
      if (initial) {
        await api(`/api/v1/admin/products/${initial.id}`, { method: "PUT", token, body: JSON.stringify(body) });
      } else {
        await api("/api/v1/admin/products", { method: "POST", token, body: JSON.stringify(body) });
      }
      router.push("/admin/products");
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
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="label">Brand</label>
          <input className="input" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
        </div>
        <div>
          <label className="label">SKU</label>
          <input className="input" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
        </div>
        <div>
          <label className="label">Pack size</label>
          <input className="input" value={form.pack_size} onChange={(e) => setForm({ ...form, pack_size: e.target.value })} placeholder="500g / 1L" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="label">MRP (₹)</label>
          <input type="number" min={0} className="input" value={form.mrp_rupees} onChange={(e) => setForm({ ...form, mrp_rupees: Number(e.target.value) })} />
        </div>
        <div>
          <label className="label">Our price (₹)</label>
          <input type="number" min={0} className="input" value={form.our_price_rupees} onChange={(e) => setForm({ ...form, our_price_rupees: Number(e.target.value) })} />
        </div>
      </div>
      <div>
        <label className="label">Image URL</label>
        <input className="input" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input min-h-[120px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <label className="inline-flex items-center gap-2">
        <input type="checkbox" checked={form.in_stock} onChange={(e) => setForm({ ...form, in_stock: e.target.checked })} />
        <span className="text-sm">In stock</span>
      </label>
      {err && <div className="text-sm text-red-600">{err}</div>}
      <button className="btn-primary" disabled={busy}>{busy ? "Saving..." : initial ? "Update product" : "Create product"}</button>
    </form>
  );
}
