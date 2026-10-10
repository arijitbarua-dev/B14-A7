import Link from "next/link";

export interface Product {
    id: number | string;
    slug: string;
    nameBn: string;
    unit: string;
    image?: string;
    categoryIcon?: string;
    today: number;
    change?: {
        dir: "up" | "down" | "flat";
        pct: number;
    };
}

const unitMap: Record<string, string> = {
    kg: "কেজি",
    litre: "লিটার",
    liter: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
    haali: "হালি",
};

const toBn = (n: number | string) => {
    if (n === undefined || n === null) return "";
    const formatted = typeof n === "number" ? n.toLocaleString("bn-BD") : n.toString();
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return formatted.replace(/\d/g, (d) => banglaDigits[parseInt(d, 10)]);
};

const ProductCard = ({ product }: { product: Product }) => {
    const unitBn = unitMap[product.unit] || product.unit || "কেজি";
    const isUp = product.change?.dir === "up" || (product.change?.pct && product.change.pct > 0);
    const isDown = product.change?.dir === "down" || (product.change?.pct && product.change.pct < 0);
    const pctVal = product.change?.pct ? Math.abs(product.change.pct).toFixed(1) : "0.0";

    return (
        <Link
            href={`/products/${product.slug}`}
            className="group flex flex-col justify-between rounded-[22px] border-2 border-gray-200 bg-white/90 p-4 transition-all duration-150 hover:border-[#039648] hover:shadow-sm cursor-pointer"
        >
            {/* Top Row: Emoji Icon + Product Name & Unit */}
            <div className="flex items-start gap-3.5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gray-50 text-2xl transition-transform group-hover:scale-105">
                    {product.image || product.categoryIcon || "🛒"}
                </div>
                <div className="flex flex-col">
                    <h3 className="text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-[#039648]">
                        {product.nameBn}
                    </h3>
                    <span className="mt-0.5 text-xs font-normal text-gray-500">
                        প্রতি {unitBn}
                    </span>
                </div>
            </div>

            {/* Bottom Row: Today's Price + Change Badge */}
            <div className="mt-4 flex items-end justify-between border-t border-gray-100 pt-3">
                <div className="flex flex-col">
                    <span className="text-[11px] font-medium text-gray-400">
                        আজকের দাম
                    </span>
                    <span className="text-base font-bold text-gray-900 sm:text-lg">
                        {toBn(product.today)} টাকা
                    </span>
                </div>

                <div>
                    {isUp && (
                        <span className="inline-flex items-center gap-0.5 rounded-lg bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">
                            ▲ {toBn(pctVal)}%
                        </span>
                    )}
                    {isDown && (
                        <span className="inline-flex items-center gap-0.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
                            ▼ {toBn(pctVal)}%
                        </span>
                    )}
                    {!isUp && !isDown && (
                        <span className="inline-flex items-center gap-0.5 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                            — 0.0%
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;