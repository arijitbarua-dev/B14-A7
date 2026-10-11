import { Suspense } from "react";
import Hero from "@/components/Hero";
import ProductsCard from "@/components/ProductsCard";
import ProductSkeleton from "@/components/ProductSkeleton";

export default function Home() {
  return (
    <main className="flex-1 bg-[#edf4ee] pb-16">
      <Hero />

      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-8">
            <ProductSkeleton count={8} />
          </div>
        }
      >
        <ProductsCard />
      </Suspense>
    </main>
  );
}