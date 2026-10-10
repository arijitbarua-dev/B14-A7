import ProductCard, { Product } from "./ProductDetails";

const ProductsCard = async () => {
    let products: Product[] = [];

    try {
        const res = await fetch("https://api.abcz.workers.dev/api/bazardor/products", {
            next: { revalidate: 60 },
        });
        const data = await res.json();
        products = Array.isArray(data) ? data : data?.data || [];
    } catch (error) {
        console.error("Failed to fetch products:", error);
    }

    // Top 6 Risers (Price Increased ▲)
    const risers = products
        .filter((p) => p.change?.dir === "up" || (p.change?.pct ?? 0) > 0)
        .sort((a, b) => (b.change?.pct ?? 0) - (a.change?.pct ?? 0))
        .slice(0, 6);

    // Top 6 Fallers (Price Decreased ▼)
    const fallers = products
        .filter((p) => p.change?.dir === "down" || (p.change?.pct ?? 0) < 0)
        .sort((a, b) => (a.change?.pct ?? 0) - (b.change?.pct ?? 0))
        .slice(0, 6);

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-8 sm:px-6 lg:px-8">
            {/* Section A: Top 6 Risers (▲ আজ দাম বেড়েছে) */}
            {risers.length > 0 && (
                <section>
                    <div className="mb-4 flex items-center gap-2">
                        <span className="text-red-600 text-lg sm:text-xl font-bold">▲</span>
                        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                            আজ দাম বেড়েছে
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {risers.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </section>
            )}

            {/* Section B: Top 6 Fallers (▼ আজ দাম কমেছে) */}
            {fallers.length > 0 && (
                <section>
                    <div className="mb-4 flex items-center gap-2">
                        <span className="text-emerald-600 text-lg sm:text-xl font-bold">▼</span>
                        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                            আজ দাম কমেছে
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {fallers.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </section>
            )}

            {/* Section C: All Products (সব পণ্য) */}
            <section id="সব-পণ্য" className="scroll-mt-10">
                <div className="mb-6 flex flex-col items-start">
                    <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        সব পণ্য
                    </h2>
                    <p className="mt-1 text-sm font-normal text-gray-500">
                        একটি একটি করে দেখার জন্য
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ProductsCard;