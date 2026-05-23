import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api";
import type { Product, Category } from "@/types";

export const dynamic = "force-dynamic";

export default async function ProductsPage({ searchParams }: { searchParams: { category?: string; q?: string } }) {
  const cats = await api<Category[]>("/api/v1/categories?kind=product").catch(() => []);
  const params = new URLSearchParams();
  if (searchParams.category) {
    const cat = cats.find((c) => c.slug === searchParams.category);
    if (cat) params.set("category_id", String(cat.id));
  }
  if (searchParams.q) params.set("search", searchParams.q);
  const products = await api<Product[]>(`/api/v1/products?${params.toString()}`).catch(() => []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="eyebrow mb-3">Catalog / Products</div>
      <h1 className="display text-5xl md:text-7xl">Products</h1>
      <p className="mt-5 text-ink/70 text-lg max-w-2xl">
        Browse the catalog or submit a free-text custom request from the cart.
      </p>

      <div className="mt-12 flex flex-wrap gap-px bg-ink/15 border border-ink/15">
        <Link
          href="/products"
          className={`px-4 py-2 mono text-[11px] uppercase tracking-[0.14em] ${!searchParams.category ? "bg-ink text-white" : "bg-white hover:bg-ink/5"}`}
        >
          All
        </Link>
        {cats.map((c) => (
          <Link
            key={c.id}
            href={`/products?category=${c.slug}`}
            className={`px-4 py-2 mono text-[11px] uppercase tracking-[0.14em] ${searchParams.category === c.slug ? "bg-ink text-white" : "bg-white hover:bg-ink/5"}`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <form className="mt-6" action="/products">
        {searchParams.category && <input type="hidden" name="category" value={searchParams.category} />}
        <input
          type="search"
          name="q"
          defaultValue={searchParams.q || ""}
          placeholder="Search products, brand, SKU..."
          className="input max-w-md"
        />
      </form>

      {products.length === 0 ? (
        <div className="mt-16 border border-ink/15 p-16 text-center">
          <div className="eyebrow mb-3">Empty</div>
          <div className="text-xl">No products yet.</div>
          <p className="mt-2 text-ink/60">Add some from the admin panel, or use the custom-request flow on the cart page.</p>
        </div>
      ) : (
        <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-ink/15 border border-ink/15">
          {products.map((p) => (
            <div key={p.id} className="bg-white">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
