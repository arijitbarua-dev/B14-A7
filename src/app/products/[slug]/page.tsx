import Link from "next/link";
import { Product } from "@/components/ProductDetails";

interface Market {
    market: string;
    division: string;
    min: number;
    max: number;
}

interface ProductDetail extends Product {
    category?: string;
    categoryNameBn?: string;
    markets?: Market[];
    yesterday?: number;
}

interface Category {
    id?: number | string;
    slug?: string;
    name?: string;
    nameBn?: string;
    icon?: string;
}

interface ProductDetailProps {
    params: Promise<{
        slug: string;
    }>;
}

type ApiResponse<T> = {
    data?: T[];
};

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

    const formatted =
        typeof num === "number"
            ? num.toLocaleString("en-US", {
                maximumFractionDigits: 1,
            })
            : num.toString();

    const banglaDigits = [
        "০", "১", "২", "৩", "৪",
        "৫", "৬", "৭", "৮", "৯",
    ];

    return formatted.replace(/\d/g, (digit) =>
        banglaDigits[parseInt(digit, 10)]
    );
};

function getArray<T>(response: T[] | ApiResponse<T>): T[] {
    if (Array.isArray(response)) {
        return response;
    }

    return Array.isArray(response.data) ? response.data : [];
}

export default async function ProductDetailPage({
    params,
}: ProductDetailProps) {
    const { slug } = await params;

    let product: ProductDetail | null = null;
    let categories: Category[] = [];

    try {
        const [productsRes, categoriesRes] = await Promise.all([
            fetch(
                "https://openapi.programming-hero.com/api/bazardor/products",
                { next: { revalidate: 300 } }
            ),
            fetch(
                "https://openapi.programming-hero.com/api/bazardor/categories",
                { next: { revalidate: 3600 } }
            ),
        ]);

        if (!productsRes.ok) {
            throw new Error("Failed to fetch products");
        }

        const productsData:
            | ProductDetail[]
            | ApiResponse<ProductDetail> = await productsRes.json();

        const products = getArray(productsData);

        if (categoriesRes.ok) {
            const categoriesData:
                | Category[]
                | ApiResponse<Category> = await categoriesRes.json();

            categories = getArray(categoriesData);
        }

        product = products.find((item) => item.slug === slug) ?? null;
    } catch (error) {
        console.error("Product fetch error:", error);
    }

    if (!product) {
        return (
            <main className="min-h-screen bg-[#f0f5f1] px-4 py-16">
                <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        পণ্য পাওয়া যায়নি
                    </h1>
                    <Link
                        href="/"
                        className="mt-4 inline-block text-sm font-semibold text-[#039648] hover:underline"
                    >
                        ← হোম পেজে ফিরে যান
                    </Link>
                </div>
            </main>
        );
    }

    const unitBn = unitMap[product.unit] || product.unit || "কেজি";

    const isUp =
        product.change?.dir === "up" ||
        (product.change?.pct ?? 0) > 0;

    const isDown =
        product.change?.dir === "down" ||
        (product.change?.pct ?? 0) < 0;

    const pctVal = Math.abs(product.change?.pct ?? 0).toFixed(1);

    const category = categories.find(
        (item) =>
            item.slug === product.category ||
            String(item.id) === String(product.category) ||
            item.name === product.category
    );

    const categoryName =
        product.categoryNameBn ||
        category?.nameBn ||
        category?.name ||
        product.category ||
        "";

    const markets = (product.markets ?? []).map((market) => ({
        ...market,
        average: (Number(market.min) + Number(market.max)) / 2,
    }));

    const minPrice =
        markets.length > 0
            ? Math.min(...markets.map((market) => Number(market.min)))
            : product.today;

    const maxPrice =
        markets.length > 0
            ? Math.max(...markets.map((market) => Number(market.max)))
            : product.today;

    const avgPrice =
        markets.length > 0
            ? markets.reduce(
                (total, market) => total + market.average,
                0
            ) / markets.length
            : product.today;

    return (
        <main className="min-h-screen bg-[#f0f5f1] px-4 py-6 sm:px-8 lg:px-12">
            <div className="mx-auto w-full max-w-[1100px]">
                {/* Breadcrumb */}
                <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs text-[#69746c]">
                    <Link href="/" className="hover:text-[#039648]">
                        হোম
                    </Link>
                    <span>›</span>
                    <Link
                        href={`/category/${category?.slug || product.category || "chal"}`}
                        className="transition-colors hover:text-[#039648]"
                    >
                        {categoryName || "পণ্য"}
                    </Link>
                    <span>›</span>
                    <span className="font-medium text-[#344139]">
                        {product.nameBn}
                    </span>
                </nav>

                {/* Product Summary */}
                <section className="rounded-[16px] border border-[#e0e8e1] bg-[#fbfdfb] p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-4">
                            <div className="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-2xl bg-[#f0f5f0] text-3xl sm:h-[80px] sm:w-[80px] sm:text-4xl">
                                {product.image ||
                                    product.categoryIcon ||
                                    "🛒"}
                            </div>

                            <div className="min-w-0">
                                <h1 className="text-xl font-extrabold leading-tight text-[#27332b] sm:text-[30px]">
                                    {product.nameBn}
                                </h1>
                                <p className="mt-1 text-xs text-[#758078] sm:text-sm">
                                    প্রতি {unitBn}
                                </p>
                                <p className="mt-2 text-xs leading-5 text-[#27332b] sm:text-[13px]">
                                    গতকালের তুলনায় আজ দাম{" "}
                                    {isUp ? "বেড়েছে" : isDown ? "কমেছে" : "অপরিবর্তিত রয়েছে"}
                                    {(isUp || isDown) && (
                                        <>
                                            {" · "}
                                            {toBanglaNum(
                                                Math.abs(
                                                    product.today -
                                                    (product.yesterday ?? product.today)
                                                )
                                            )} টাকা
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="min-w-[100px] shrink-0 rounded-2xl bg-[#f0f5f0] px-3 py-3 text-center sm:min-w-[116px] sm:px-5 sm:py-4">
                            <p className="text-[10px] text-[#7b857d] sm:text-xs">
                                আজকের বাজার দর
                            </p>
                            <p className="text-2xl font-extrabold leading-8 text-[#27332b] sm:text-3xl sm:leading-9">
                                {toBanglaNum(product.today)}
                            </p>
                            <p className="text-[10px] text-[#7b857d] sm:text-xs">
                                টাকা / {unitBn}
                            </p>

                            {(isUp || isDown) && (
                                <p
                                    className={`mt-1 text-[10px] font-bold sm:text-xs ${isUp
                                        ? "text-red-600"
                                        : "text-emerald-600"
                                        }`}
                                >
                                    {isUp ? "▲" : "▼"}{" "}
                                    {toBanglaNum(pctVal)}%
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Price Summary */}
                <section className="mt-6 rounded-[16px] border border-[#e0e8e1] bg-[#fbfdfb] p-5 sm:p-6">
                    <h2 className="mb-4 text-base font-bold text-[#27332b]">
                        দামের সারসংক্ষেপ
                    </h2>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="rounded-[16px] border border-[#e0e8e1] p-4 sm:p-5">
                            <p className="text-xs text-[#7a847c]">
                                সর্বনিম্ন দাম
                            </p>
                            <p className="mt-1 text-2xl font-extrabold leading-8 text-emerald-600">
                                {toBanglaNum(minPrice)}{" "}
                                <span className="text-sm font-medium">
                                    টাকা
                                </span>
                            </p>
                            <p className="mt-1 text-xs text-[#7a847c]">
                                সবচেয়ে কম দামের বাজার
                            </p>
                        </div>

                        <div className="rounded-[16px] border border-[#e0e8e1] p-4 sm:p-5">
                            <p className="text-xs text-[#7a847c]">
                                সর্বোচ্চ দাম
                            </p>
                            <p className="mt-1 text-2xl font-extrabold leading-8 text-red-500">
                                {toBanglaNum(maxPrice)}{" "}
                                <span className="text-sm font-medium">
                                    টাকা
                                </span>
                            </p>
                            <p className="mt-1 text-xs text-[#7a847c]">
                                সবচেয়ে বেশি দামের বাজার
                            </p>
                        </div>

                        <div className="rounded-[16px] border border-[#e0e8e1] p-4 sm:p-5">
                            <p className="text-xs text-[#7a847c]">
                                গড় দাম
                            </p>
                            <p className="mt-1 text-2xl font-extrabold leading-8 text-emerald-600">
                                {toBanglaNum(Math.round(avgPrice))}{" "}
                                <span className="text-sm font-medium">
                                    টাকা
                                </span>
                            </p>
                            <p className="mt-1 text-xs text-[#7a847c]">
                                প্রতি {unitBn}-এর হিসাবে
                            </p>
                        </div>
                    </div>
                </section>

                {/* Market Comparison Table */}
                <section className="mt-6 rounded-[16px] border border-[#e0e8e1] bg-[#fbfdfb] p-5 sm:p-6">
                    <h2 className="mb-4 text-base font-bold text-[#27332b]">
                        বাজারভিত্তিক আজকের দাম
                    </h2>

                    {markets.length > 0 ? (
                        <div className="overflow-x-auto rounded-[16px] border border-[#e0e8e1]">
                            <table className="w-full min-w-[650px] border-collapse text-left text-[13px]">
                                <thead>
                                    <tr className="bg-[#f8fbf8] text-[#788179]">
                                        <th className="px-4 py-3 font-semibold">
                                            বাজার
                                        </th>
                                        <th className="px-4 py-3 font-semibold">
                                            বিভাগ
                                        </th>
                                        <th className="px-4 py-3 text-right font-semibold">
                                            সর্বনিম্ন
                                        </th>
                                        <th className="px-4 py-3 text-right font-semibold">
                                            সর্বোচ্চ
                                        </th>
                                        <th className="px-4 py-3 text-right font-semibold">
                                            গড়
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {markets.map((market, index) => (
                                        <tr
                                            key={`${market.market}-${index}`}
                                            className="border-t border-[#e5eae6] even:bg-[#f0f5f1] odd:bg-[#fbfdfb]"
                                        >
                                            <td className="px-4 py-3 font-medium text-[#344139]">
                                                {market.market}
                                            </td>
                                            <td className="px-4 py-3 text-[#344139]">
                                                {market.division}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-right text-[#344139]">
                                                {toBanglaNum(market.min)} টাকা
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-right text-[#344139]">
                                                {toBanglaNum(market.max)} টাকা
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-right font-bold text-[#27332b]">
                                                {toBanglaNum(
                                                    Math.round(market.average)
                                                )} টাকা
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="rounded-xl border border-dashed border-[#dce5dd] px-4 py-10 text-center text-sm text-[#758078]">
                            বাজারভিত্তিক দামের তথ্য পাওয়া যায়নি।
                        </p>
                    )}
                </section>
            </div>
        </main>
    );
}