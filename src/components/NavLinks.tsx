"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Category {
    id: string;
    slug: string;
    nameBn: string;
    icon: string;
}

const defaultCategories: Category[] = [
    { id: "chal", slug: "chal", nameBn: "চাল", icon: "🍚" },
    { id: "dal", slug: "dal", nameBn: "ডাল", icon: "🫘" },
    { id: "tel", slug: "tel", nameBn: "তেল", icon: "🛢️" },
    { id: "sobji", slug: "sobji", nameBn: "সবজি", icon: "🥬" },
    { id: "mach", slug: "mach", nameBn: "মাছ", icon: "🐟" },
    { id: "mangsho", slug: "mangsho", nameBn: "মাংস", icon: "🍗" },
    { id: "dim-dui", slug: "dim-dui", nameBn: "ডিম-দুধ", icon: "🥛" },
    { id: "mosla", slug: "mosla", nameBn: "মসলা", icon: "🌶️" },
];

const NavLinks = () => {
    const pathname = usePathname();
    const [categories, setCategories] = useState<Category[]>(defaultCategories);

    useEffect(() => {
        fetch("https://api.abcz.workers.dev/api/bazardor/categories")
            .then((res) => res.json())
            .then((data) => {
                const list = Array.isArray(data) ? data : data?.data;
                if (Array.isArray(list) && list.length > 0) {
                    setCategories(list);
                }
            })
            .catch((err) => {
                console.error("Failed to fetch categories:", err);
            });
    }, []);

    return (
        <nav className="w-full border-t border-gray-200/60 bg-white/70 backdrop-blur-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-center overflow-x-auto px-4 py-2 sm:px-6">
                <div className="flex items-center gap-1.5 sm:gap-3 md:gap-5 py-0.5">
                    {categories.map((item) => {
                        const href = `/category/${item.slug}`;
                        const isActive = pathname === href;

                        return (
                            <Link
                                key={item.id}
                                href={href}
                                className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? "bg-[#039648] text-white shadow-sm font-semibold scale-105"
                                        : "text-gray-700 hover:bg-[#039648]/10 hover:text-[#039648]"
                                }`}
                            >
                                <span className="text-base leading-none">{item.icon}</span>
                                <span>{item.nameBn}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default NavLinks;
