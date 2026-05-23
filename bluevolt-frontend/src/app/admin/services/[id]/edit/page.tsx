"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Service } from "@/types";
import ServiceForm from "@/components/ServiceForm";

export default function EditServicePage({ params }: { params: { id: string } }) {
  const [s, setS] = useState<Service | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api<Service[]>("/api/v1/services?limit=200")
      .then((list) => {
        const found = list.find((x) => String(x.id) === params.id);
        if (!found) setErr("Not found");
        else setS(found);
      })
      .catch(() => setErr("Failed to load"));
  }, [params.id]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Edit service</h1>
      <div className="mt-6">
        {err ? <div className="text-red-600">{err}</div> : s ? <ServiceForm initial={s} /> : <div className="text-ink/60">Loading...</div>}
      </div>
    </div>
  );
}
