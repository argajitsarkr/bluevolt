import ServiceForm from "@/components/ServiceForm";

export default function NewServicePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">Add service</h1>
      <div className="mt-6">
        <ServiceForm />
      </div>
    </div>
  );
}
