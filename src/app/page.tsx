import Hero from "@/components/Hero";
import ProductsCard from "@/components/ProductsCard";

export default function Home() {
  return (
    <main className="flex-1 bg-[#edf4ee] pb-16">
      <Hero />
      <ProductsCard />
    </main>
  );
}