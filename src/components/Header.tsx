import Image from "next/image";
import Link from "next/link";
import NavLinks from "./NavLinks";

const Header = () => {
    const date = new Date().toLocaleDateString("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <header className="w-full border-b border-gray-200/80 bg-[#f8faf7]">
            {/* Top Row: Logo, Brand & Auth Buttons */}
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                {/* Left side: Logo & Brand Name + Bangla Date */}
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-3 group">
                        {/* Green rounded icon container */}
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#039648] p-2 shadow-sm transition-transform group-hover:scale-105">
                            <Image
                                src="/logo-icon.png"
                                alt="logo of bazar dor"
                                width={26}
                                height={26}
                                className="object-contain filter brightness-200"
                                priority
                            />
                        </div>

                        {/* Brand Name & Date */}
                        <div className="flex flex-col justify-center">
                            <span className="text-xl font-bold text-gray-900 leading-tight sm:text-[22px]">
                                বাজার দর
                            </span>
                            <span
                                suppressHydrationWarning
                                className="text-xs font-normal text-gray-500 mt-0.5"
                            >
                                {date}
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Right side: Auth buttons */}
                <div className="flex items-center gap-3 text-sm font-semibold">
                    <button className="cursor-pointer rounded-xl px-4 py-2 text-gray-800 transition-all duration-200 hover:bg-[#039648]/10 hover:text-[#039648] active:scale-95">
                        সাইন ইন
                    </button>
                    <button className="cursor-pointer rounded-xl bg-[#039648] px-5 py-2.5 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#027e3c] hover:shadow-md hover:scale-[1.03] active:scale-95">
                        সাইন আপ
                    </button>
                </div>
            </div>

            {/* Second Row: Middle Category Links */}
            <NavLinks />
        </header>
    );
};

export default Header;
