import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="flex-1 bg-[#edf4ee] pb-16">
      <Hero />
      <section id="সব-পণ্য" className="mx-auto max-w-7xl px-4 py-8 scroll-mt-10 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900">সব পণ্য</h2>
      </section>
    </main>
  );
}
