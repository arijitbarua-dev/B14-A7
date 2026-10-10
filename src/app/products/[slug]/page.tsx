import Link from "next/link";
import { Product } from "@/components/ProductDetails";

interface ProductDetailProps {
    params: Promise<{
        slug: string;
    }>;
}

const unitMap: Record<string, string> = {
    kg: "কেজি",
    litre: "লিটার",
    liter: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
    haali: "হালি",
};

const toBanglaNum = (num: number | string): string => {
    if (num === undefined || num === null) return "";
    const formatted = typeof num === "number" ? num.toLocaleString("bn-BD") : num.toString();
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return formatted.replace(/\d/g, (d) => banglaDigits[parseInt(d, 10)]);
};

export default async function ProductDetailPage({ params }: ProductDetailProps) {
    const { slug } = await params;

    let product: Product | null = null;
    try {
        const res = await fetch(`https://api.abcz.workers.dev/api/bazardor/products/${slug}`);
        const data = await res.json();
        product = data.data || data;
    } catch {
        const res = await fetch("https://api.abcz.workers.dev/api/bazardor/products");
        const data = await res.json();
        const list: Product[] = Array.isArray(data) ? data : data?.data || [];
        product = list.find((p) => p.slug === slug) || null;
    }

    if (!product) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-gray-900">পণ্য পাওয়া যায়নি</h1>
                <Link href="/" className="mt-4 inline-block text-sm font-semibold text-[#039648] hover:underline">
                    ← হোম পেজে ফিরে যান
                </Link>
            </div>
        );
    }

    const unitBn = unitMap[product.unit] || product.unit || "কেজি";
    const isUp = product.change?.dir === "up" || (product.change?.pct && product.change.pct > 0);
    const isDown = product.change?.dir === "down" || (product.change?.pct && product.change.pct < 0);
    const pctVal = product.change?.pct ? Math.abs(product.change.pct).toFixed(1) : "0.0";

    return (
        <main className="min-h-screen bg-[#edf4ee] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                {/* Back Link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors hover:text-[#039648] mb-6"
                >
                    ← পূর্ববর্তী পেজে ফিরে যান
                </Link>

                {/* Main Card */}
                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-10">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-4xl">
                                {product.image || product.categoryIcon || "🛒"}
                            </div>
                            <div>
                                <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                                    {product.nameBn}
                                </h1>
                                <p className="mt-1 text-sm font-medium text-gray-500">
                                    প্রতি {unitBn}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-start sm:items-end">
                            <span className="text-xs font-medium text-gray-400">
                                আজকের বাজার দর
                            </span>
                            <div className="mt-1 flex items-center gap-3">
                                <span className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                                    {toBanglaNum(product.today)} টাকা
                                </span>
                                {isUp && (
                                    <span className="rounded-xl bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
                                        ▲ {toBanglaNum(pctVal)}%
                                    </span>
                                )}
                                {isDown && (
                                    <span className="rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
                                        ▼ {toBanglaNum(pctVal)}%
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}