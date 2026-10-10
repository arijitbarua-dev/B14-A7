"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ProductCard, { Product } from "@/components/ProductDetails";

interface Category {
    id: string | number;
    slug: string;
    nameBn: string;
    icon: string;
}

type CategoryProduct = Product & {
    categoryId?: string | number;
    category_id?: string | number;
    categorySlug?: string;
    category_slug?: string;
    categoryName?: string;
    categoryNameBn?: string;
    categoryBn?: string;
    category?: string | number | Record<string, unknown> | null;
    categories?: unknown[];
};

const toEnglishDigits = (value: string) =>
    value
        .replace(/[০-৯]/g, (digit) =>
            String("০১২৩৪৫৬৭৮৯".indexOf(digit))
        );

function normalizeCategory(data: Record<string, unknown>): Category {
    return {
        id: (data.id ?? data._id ?? data.slug ?? "") as string | number,
        slug: String(data.slug ?? data.categorySlug ?? data.category_slug ?? ""),
        nameBn: String(
            data.nameBn ??
                data.name_bn ??
                data.categoryNameBn ??
                data.name ??
                data.title ??
                ""
        ),
        icon: String(
            data.icon ??
                data.categoryIcon ??
                data.category_icon ??
                data.emoji ??
                "🛒"
        ),
    };
}

function getCategoryValues(product: CategoryProduct): string[] {
    const values: string[] = [];

    const add = (value: unknown) => {
        if (value === undefined || value === null || value === "") return;

        if (typeof value === "object" && !Array.isArray(value)) {
            const obj = value as Record<string, unknown>;

            [
                obj.id,
                obj._id,
                obj.slug,
                obj.categoryId,
                obj.category_id,
                obj.categorySlug,
                obj.category_slug,
                obj.nameBn,
                obj.name_bn,
                obj.name,
                obj.title,
            ].forEach(add);

            return;
        }

        if (Array.isArray(value)) {
            value.forEach(add);
            return;
        }

        values.push(String(value).trim().toLowerCase());
    };

    add(product.categoryId);
    add(product.category_id);
    add(product.categorySlug);
    add(product.category_slug);
    add(product.categoryName);
    add(product.categoryNameBn);
    add(product.categoryBn);
    add(product.category);
    add(product.categories);

    return values;
}

function parsePrice(value: number | string): number {
    const normalized = toEnglishDigits(String(value ?? ""));
    const parsed = Number(normalized.replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
}

function SkeletonCard() {
    return (
        <div className="h-[110px] animate-pulse rounded-2xl border border-[#e0e9e1] bg-white/80 p-3">
            <div className="flex gap-3">
                <div className="h-10 w-10 rounded-xl bg-gray-200" />
                <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 w-24 rounded bg-gray-200" />
                    <div className="h-3 w-16 rounded bg-gray-100" />
                </div>
            </div>
            <div className="mt-4 h-4 w-28 rounded bg-gray-200" />
        </div>
    );
}

export default function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug: routeSlug } = use(params);
    const slug = decodeURIComponent(routeSlug).toLowerCase();

    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<CategoryProduct[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);
    const [sort, setSort] = useState("default");

    useEffect(() => {
        let active = true;

        async function loadCategories() {
            setCategoriesLoading(true);

            try {
                const response = await fetch(
                    "https://api.abcz.workers.dev/api/bazardor/categories",
                    { cache: "no-store" }
                );

                if (!response.ok) {
                    throw new Error("Failed to load categories");
                }

                const data = await response.json();
                const list = Array.isArray(data)
                    ? data
                    : data?.data ?? data?.categories ?? [];

                const normalized = list
                    .filter(
                        (item: unknown) =>
                            item !== null && typeof item === "object"
                    )
                    .map((item: Record<string, unknown>) =>
                        normalizeCategory(item)
                    )
                    .filter((item: Category) => item.slug && item.nameBn);

                if (active) {
                    setCategories(normalized);
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);

                if (active) {
                    setCategories([]);
                    setFetchError(true);
                }
            } finally {
                if (active) setCategoriesLoading(false);
            }
        }

        loadCategories();

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        let active = true;

        async function loadProducts() {
            setProductsLoading(true);

            try {
                const response = await fetch(
                    "https://api.abcz.workers.dev/api/bazardor/products",
                    { cache: "no-store" }
                );

                if (!response.ok) {
                    throw new Error("Failed to load products");
                }

                const data = await response.json();
                const list: CategoryProduct[] = Array.isArray(data)
                    ? data
                    : data?.data ?? data?.products ?? [];

                if (active) setProducts(list);
            } catch (error) {
                console.error("Failed to fetch products:", error);

                if (active) {
                    setProducts([]);
                    setFetchError(true);
                }
            } finally {
                if (active) setProductsLoading(false);
            }
        }

        loadProducts();

        return () => {
            active = false;
        };
    }, []);

    const category = categories.find(
        (item) => item.slug.toLowerCase() === slug
    );

    const filteredProducts = useMemo(() => {
        if (!category) return [];

        const acceptedValues = [
            String(category.id).toLowerCase(),
            category.slug.toLowerCase(),
            category.nameBn.toLowerCase(),
        ];

        const filtered = products.filter((product) => {
            const values = getCategoryValues(product);

            return values.some((value) =>
                acceptedValues.includes(value)
            );
        });

        return [...filtered].sort((a, b) => {
            if (sort === "asc") {
                return parsePrice(a.today) - parsePrice(b.today);
            }

            if (sort === "desc") {
                return parsePrice(b.today) - parsePrice(a.today);
            }

            return 0;
        });
    }, [products, category, sort]);

    const loading = categoriesLoading || productsLoading;

    if (loading) {
        return (
            <main className="min-h-screen bg-[#edf4ee] px-4 py-5 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-5 flex min-h-[74px] animate-pulse items-center rounded-xl border border-[#e0e9e1] bg-white/80 px-5">
                        <div className="h-11 w-11 rounded-xl bg-gray-200" />
                        <div className="ml-3 space-y-2">
                            <div className="h-5 w-24 rounded bg-gray-200" />
                            <div className="h-3 w-48 rounded bg-gray-100" />
                        </div>
                    </div>

                    <div className="mb-5 h-[52px] animate-pulse rounded-xl border border-[#e0e9e1] bg-white/80" />

                    <p className="mb-3 text-xs text-gray-500">
                        পণ্য লোড হচ্ছে...
                    </p>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    if (fetchError || !category || filteredProducts.length === 0) {
        const title = fetchError
            ? "পণ্য লোড করা যায়নি"
            : !category
              ? "বিভাগ পাওয়া যায়নি"
              : "পণ্য পাওয়া যায়নি";

        const message = fetchError
            ? "ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।"
            : !category
              ? "এই বিভাগের ঠিকানা সঠিক নয়।"
              : "এই বিভাগে এখন কোনো পণ্য পাওয়া যাচ্ছে না।";

        return (
            <main className="flex min-h-screen items-center justify-center bg-[#edf4ee] px-4 py-12">
                <div className="w-full max-w-md rounded-2xl border border-[#e0e9e1] bg-white p-8 text-center">
                    <div className="mb-3 text-4xl">
                        {category?.icon || "🔎"}
                    </div>

                    <h1 className="text-xl font-bold text-gray-900">
                        {title}
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        {message}
                    </p>

                    <Link
                        href="/"
                        className="mt-5 inline-flex rounded-lg bg-[#039648] px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                    >
                        হোম পেজে ফিরে যান
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#edf4ee] px-4 py-5 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                {/* Category title */}
                <section className="flex min-h-[74px] items-center gap-3 rounded-xl border border-[#e0e9e1] bg-white/80 px-4 py-3 sm:px-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f0f5f0] text-2xl">
                        {category.icon}
                    </div>

                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            {category.nameBn}
                        </h1>

                        <p className="text-xs text-gray-500">
                            {filteredProducts.length.toLocaleString("bn-BD")} টি
                            পণ্যের আজকের দাম ও পরিবর্তন
                        </p>
                    </div>
                </section>

                {/* Sort dropdown */}
                <div className="mt-5 flex min-h-[52px] items-center justify-end gap-2 rounded-xl border border-[#e0e9e1] bg-white/80 px-4 py-3">
                    <label
                        htmlFor="sort-products"
                        className="text-xs text-gray-500"
                    >
                        সাজান
                    </label>

                    <div className="relative">
                        <select
                            id="sort-products"
                            value={sort}
                            onChange={(event) =>
                                setSort(event.target.value)
                            }
                            className="appearance-none rounded-lg border border-gray-300 bg-transparent py-1.5 pl-3 pr-8 text-xs text-gray-800 outline-none focus:border-[#039648]"
                        >
                            <option value="default">ডিফল্ট</option>
                            <option value="asc">
                                দাম: কম থেকে বেশি
                            </option>
                            <option value="desc">
                                দাম: বেশি থেকে কম
                            </option>
                        </select>

                        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-700">
                            ⌄
                        </span>
                    </div>
                </div>

                {/* Product cards */}
                <p className="mb-3 mt-3 text-xs text-gray-500">
                    মোট{" "}
                    {filteredProducts.length.toLocaleString("bn-BD")} টি
                    পণ্য দেখানো হচ্ছে
                </p>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}