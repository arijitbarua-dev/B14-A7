import ProductSkeleton from "@/components/ProductSkeleton";

export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-gray-200" />
      <ProductSkeleton count={8} />
    </main>
  );
}