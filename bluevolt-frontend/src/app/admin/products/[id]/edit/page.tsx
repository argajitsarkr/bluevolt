"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Product } from "@/types";
import ProductForm from "@/components/ProductForm";

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [p, setP] = useState<Product | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    // fetch all then find - keeps it simple; admin pages are small
    api<Product[]>("/api/v1/products?limit=200")
      .then((list) => {
        const found = list.find((x) => String(x.id) === params.id);
        if (!found) setErr("Not found");
        else setP(found);
      })
      .catch(() => setErr("Failed to load"));
  }, [params.id]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Edit product</h1>
      <div className="mt-6">
        {err ? <div className="text-red-600">{err}</div> : p ? <ProductForm initial={p} /> : <div className="text-ink/60">Loading...</div>}
      </div>
    </div>
  );
}
