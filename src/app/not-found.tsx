import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#edf4ee] px-4 py-12">
            <div className="w-full max-w-md rounded-2xl border border-[#e0e9e1] bg-white p-8 text-center">
                <p className="text-7xl font-extrabold text-[#039648]">
                    404
                </p>

                <h1 className="mt-5 text-xl font-bold text-gray-900">
                    দুঃখিত! পেজটি খুঁজে পাওয়া যায়নি
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                    আপনি যে পেজটি খুঁজছেন সেটি পাওয়া যায়নি।
                    ঠিকানাটি ভুল হতে পারে অথবা পেজটি সরিয়ে ফেলা হয়েছে।
                </p>

                <Link
                    href="/"
                    className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#039648] px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                    ← হোম পেজে ফিরে যান
                </Link>
            </div>
        </main>
    );
}