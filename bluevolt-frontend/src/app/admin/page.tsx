"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "@/lib/api";

type Stats = {
  total_orders: number;
  pending_orders: number;
  total_users: number;
  total_products: number;
  total_services: number;
};

export default function AdminHome() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const token = (session?.user as any)?.backendToken;
    if (!token) return;
    api<Stats>("/api/v1/admin/stats", { token }).then(setStats).catch(() => {});
  }, [session]);

  const tiles = [
    { label: "Total orders", value: stats?.total_orders ?? "-" },
    { label: "Pending orders", value: stats?.pending_orders ?? "-", highlight: true },
    { label: "Users", value: stats?.total_users ?? "-" },
    { label: "Products", value: stats?.total_products ?? "-" },
    { label: "Services", value: stats?.total_services ?? "-" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Admin</h1>
      <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-5 gap-3">
        {tiles.map((t) => (
          <div key={t.label} className={`card p-4 ${t.highlight ? "border-brand bg-brand-50" : ""}`}>
            <div className="text-xs uppercase font-mono text-ink/60">{t.label}</div>
            <div className="text-2xl font-bold mt-1">{t.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <Link href="/admin/orders" className="card p-5 hover:bg-ink/5">
          <div className="font-medium">Orders</div>
          <p className="text-sm text-ink/60 mt-1">View, filter, and update order status.</p>
        </Link>
        <Link href="/admin/products" className="card p-5 hover:bg-ink/5">
          <div className="font-medium">Products</div>
          <p className="text-sm text-ink/60 mt-1">Manage catalog items + prices.</p>
        </Link>
        <Link href="/admin/services" className="card p-5 hover:bg-ink/5">
          <div className="font-medium">Services</div>
          <p className="text-sm text-ink/60 mt-1">Manage instrument-repair and servicing offerings.</p>
        </Link>
      </div>
    </div>
  );
}
