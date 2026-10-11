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
        fetch("https://openapi.programming-hero.com/api/bazardor/categories")
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
        <nav className="w-full min-w-0 border-t border-gray-200/60 bg-white/70 backdrop-blur-sm">
            <div className="mx-auto flex w-full max-w-7xl items-center overflow-x-auto overscroll-x-contain px-3 py-2 sm:px-6 lg:justify-center">
                <div className="flex w-max min-w-full items-center justify-start gap-1.5 py-0.5 sm:w-auto sm:min-w-0 sm:gap-3 md:gap-5 lg:justify-center">
                    {categories.map((item) => {
                        const href = `/category/${item.slug}`;
                        const isActive = pathname === href;

                        return (
                            <Link
                                key={item.id}
                                href={href}
                                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-medium transition-all duration-200 sm:px-3 sm:py-1.5 sm:text-sm ${isActive
                                        ? "bg-[#039648] font-semibold text-white shadow-sm"
                                        : "text-gray-700 hover:bg-[#039648]/10 hover:text-[#039648]"
                                    }`}
                            >
                                <span className="text-sm leading-none sm:text-base">{item.icon}</span>
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