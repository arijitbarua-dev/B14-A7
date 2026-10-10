const Footer = () => {
    return (
        <footer className="w-full border-t border-gray-200 bg-[#f8faf8]">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-center text-[10px] text-[#3f4842] sm:flex-row sm:gap-4 sm:px-6 sm:py-3 sm:text-left md:px-8">
                <p className="min-w-0">
                    বাজার দর — প্রাত্যহিক পণ্যের দাম এক নজরে।
                </p>

                <p className="min-w-0 sm:text-right">
                    সকল দাম সময়ের; বাজার অবস্থা এবং নির্ভর করে পরিবর্তিত হয়।
                </p>
            </div>
        </footer>
    );
};

export default Footer;