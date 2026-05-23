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
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Products</h1>
      <p className="text-ink/70 mt-1">Browse catalog. Add to cart or submit a custom request.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/products"
          className={`chip border ${!searchParams.category ? "bg-brand text-white border-brand" : "border-ink/15 hover:bg-ink/5"} px-3 py-1`}
        >
          All
        </Link>
        {cats.map((c) => (
          <Link
            key={c.id}
            href={`/products?category=${c.slug}`}
            className={`chip border ${searchParams.category === c.slug ? "bg-brand text-white border-brand" : "border-ink/15 hover:bg-ink/5"} px-3 py-1`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <form className="mt-4" action="/products">
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
        <div className="mt-10 card p-10 text-center text-ink/60">
          No products yet. Add some from the admin panel, or use the custom-request flow on the cart page.
        </div>
      ) : (
        <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
