import Image from "next/image";
import Link from "next/link";

const Hero = () => {
    const date = new Date().toLocaleDateString("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <section className="w-full bg-[#edf4ee] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between rounded-3xl bg-white p-8 shadow-sm sm:p-12 lg:flex-row lg:gap-12 lg:p-14">
                {/* Left Content */}
                <div className="flex flex-col items-start text-left lg:max-w-2xl">
                    {/* Eyebrow / small text */}
                    <span
                        suppressHydrationWarning
                        className="inline-flex items-center rounded-full bg-[#dcfce7] px-4 py-1.5 text-xs font-semibold text-[#039648]"
                    >
                        {date}
                    </span>

                    {/* Main Heading */}
                    <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-[42px] leading-tight">
                        আজকের বাজারের দাম এক নজরে
                    </h1>

                    {/* Subtitle */}
                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-500 sm:text-base font-normal">
                        চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
                    </p>

                    {/* Primary CTA Button */}
                    <Link
                        href="#সব-পণ্য"
                        className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#039648] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#027e3c] active:scale-95"
                    >
                        সব পণ্য দেখুন
                    </Link>
                </div>

                {/* Right Side Image */}
                <div className="mt-8 flex justify-center lg:mt-0 lg:flex-shrink-0">
                    <div className="relative w-64 sm:w-80 lg:w-[320px]">
                        <Image
                            src="/bazar-hero.png"
                            alt="আজকের বাজার পণ্য বাস্কেট"
                            width={320}
                            height={280}
                            className="h-auto w-full object-contain"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
