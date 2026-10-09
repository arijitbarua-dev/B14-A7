import MarqueeText from "react-marquee-text"
import "react-marquee-text/dist/styles.css"

interface Change {
    dir: "up" | "down" | "flat"
    pct: number
}

interface Product {
    id: number | string
    nameBn: string
    unit: string
    today: number
    image?: string
    categoryIcon?: string
    change?: Change
}

const unitMap: Record<string, string> = {
    kg: "কেজি",
    litre: "লিটার",
    liter: "লিটার",
    dozen: "ডজন",
    piece: "টি",
}

const toBn = (n: number | string) => n?.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]) || ""

const Marquee = async () => {
    const res = await fetch("https://api.abcz.workers.dev/api/bazardor/products")
    const data = await res.json()
    const headlines: Product[] = Array.isArray(data) ? data : data.data || []

    return (
        <div className="w-full border-t border-b border-gray-200/80 bg-[#f8faf7] py-2 text-xs sm:text-sm font-medium select-none">
            <MarqueeText direction="right" duration={35}>
                <div className="flex items-center">
                    {headlines.map((h) => {
                        const unit = unitMap[h.unit] || h.unit || "কেজি"
                        const isUp = h.change?.dir === "up" || (h.change?.pct ?? 0) > 0
                        const isDown = h.change?.dir === "down" || (h.change?.pct ?? 0) < 0
                        const pct = Math.abs(h.change?.pct ?? 0)

                        return (
                            <div key={h.id} className="flex items-center gap-2 border-r border-gray-200/80 px-4 whitespace-nowrap">
                                <span className="text-base">{h.image || h.categoryIcon || "🛒"}</span>
                                <span className="font-semibold text-gray-900">{h.nameBn}</span>
                                <span className="text-gray-600">{toBn(h.today)} টাকা/{unit}</span>
                                {isUp && <span className="font-bold text-red-600 flex items-center gap-0.5">▲ {toBn(pct)}%</span>}
                                {isDown && <span className="font-bold text-emerald-600 flex items-center gap-0.5">▼ {toBn(pct)}%</span>}
                                {!isUp && !isDown && <span className="text-gray-400">০%</span>}
                            </div>
                        )
                    })}
                </div>
            </MarqueeText>
        </div>
    )
}

export default Marquee
