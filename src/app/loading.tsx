import ProductSkeleton from "@/components/ProductSkeleton";

export default function Loading() {
  return (
    <main className="flex-1 bg-[#edf4ee] pb-16">
      <div className="container mx-auto px-4 py-8">
        <ProductSkeleton count={8} />
      </div>
    </main>
  );
}