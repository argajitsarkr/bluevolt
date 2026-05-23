"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Product } from "@/types";
import { inr } from "@/lib/format";

export default function AdminProductsPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await api<Product[]>("/api/v1/products?limit=200").catch(() => []);
    setProducts(data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const del = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    const token = (session?.user as any)?.backendToken;
    await api(`/api/v1/admin/products/${id}`, { method: "DELETE", token });
    load();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-baseline justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-sm text-ink/60 hover:underline">← Admin</Link>
          <Link href="/admin/products/new" className="btn-primary text-sm">+ Add product</Link>
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
                <th className="p-3">Brand / SKU</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-ink/10">
                  <td className="p-3 font-medium">{p.name}<div className="text-xs text-ink/50">{p.pack_size}</div></td>
                  <td className="p-3">{p.brand}<div className="text-xs text-ink/50">{p.sku}</div></td>
                  <td className="p-3">
                    {inr(p.our_price_paise)}
                    {p.mrp_paise > p.our_price_paise && (
                      <div className="text-xs text-ink/50 line-through">{inr(p.mrp_paise)}</div>
                    )}
                  </td>
                  <td className="p-3">{p.in_stock ? "✓" : "✗"}</td>
                  <td className="p-3 text-right space-x-3">
                    <Link href={`/admin/products/${p.id}/edit`} className="text-brand hover:underline">Edit</Link>
                    <button onClick={() => del(p.id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-ink/60">No products yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
