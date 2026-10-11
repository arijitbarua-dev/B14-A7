import Image from "next/image";
import Link from "next/link";
import NavLinks from "./NavLinks";
import Marquee from "./Marquee";
import AuthButtons from "./AuthButtons";

const Header = () => {
    const date = new Date().toLocaleDateString("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <header className="w-full min-w-0 overflow-x-clip border-b border-gray-200/80 bg-[#f8faf7]">
            {/* Top Row: Logo, Brand & Auth Buttons */}
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-6 lg:px-8">
                {/* Left side: Logo & Brand Name + Bangla Date */}
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <Link href="/" className="group flex min-w-0 items-center gap-2 sm:gap-3">
                        {/* Green rounded icon container */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#039648] p-2 shadow-sm transition-transform group-hover:scale-105 sm:h-11 sm:w-11">
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
                            <span className="text-lg font-bold leading-tight text-gray-900 sm:text-[22px]">
                                বাজার দর
                            </span>
                            <span
                                suppressHydrationWarning
                                className="mt-0.5 max-w-full text-[10px] font-normal leading-relaxed text-gray-500 sm:text-xs"
                            >
                                {date}
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Right side: Auth buttons */}
                <div className="flex shrink-0 items-center">
                    <AuthButtons />
                </div>
            </div>

            {/* Second Row: Middle Category Links */}
            <NavLinks />

            {/* Third Row: Infinite Price Ticker Marquee */}
            <Marquee />
        </header>
    );
};

export default Header;