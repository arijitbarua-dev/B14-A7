"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

export default function AuthButtons() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("সফলভাবে লগআউট হয়েছে!");
      router.push("/signin");
      router.refresh();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "লগআউট করতে সমস্যা হয়েছে।";
      toast.error(msg);
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center gap-2.5">
        <div className="h-9 w-20 rounded-xl bg-gray-200/80 animate-pulse"></div>
        <div className="h-9 w-24 rounded-xl bg-gray-200/80 animate-pulse"></div>
      </div>
    );
  }

  if (session?.user) {
    const userInitial = session.user.name
      ? session.user.name.charAt(0).toUpperCase()
      : "ইউ";

    return (
      <div className="flex items-center gap-2.5 text-sm font-semibold">
        <Link
          href="/profile"
          className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-gray-800 transition-all duration-200 hover:bg-[#039648]/10 hover:text-[#039648]"
          title="প্রোফাইল দেখুন"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#039648] text-white text-xs font-bold shadow-xs">
            {userInitial}
          </div>
          <span className="hidden sm:inline max-w-[120px] truncate text-xs sm:text-sm">
            {session.user.name || "প্রোফাইল"}
          </span>
        </Link>

        <button
          onClick={handleLogout}
          className="cursor-pointer rounded-xl bg-red-50 px-3.5 py-2 text-xs sm:text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-100 active:scale-95"
        >
          লগআউট
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm font-semibold">
      <Link
        href="/signin"
        className="cursor-pointer rounded-xl px-4 py-2 text-gray-800 transition-all duration-200 hover:bg-[#039648]/10 hover:text-[#039648] active:scale-95"
      >
        সাইন ইন
      </Link>
      <Link
        href="/signup"
        className="cursor-pointer rounded-xl bg-[#039648] px-5 py-2.5 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#027e3c] hover:shadow-md hover:scale-[1.03] active:scale-95"
      >
        সাইন আপ
      </Link>
    </div>
  );
}
