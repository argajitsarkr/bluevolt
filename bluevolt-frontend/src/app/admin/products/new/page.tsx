import ProductForm from "@/components/ProductForm";

export default function NewProductPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Add product</h1>
      <div className="mt-6">
        <ProductForm />
      </div>
    </div>
  );
}
