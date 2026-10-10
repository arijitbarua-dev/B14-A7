"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

export default function AuthButtons() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authClient.signOut();

      setProfileOpen(false);
      toast.success("সফলভাবে লগআউট হয়েছে!");
      router.push("/signin");
      router.refresh();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "লগআউট করতে সমস্যা হয়েছে।";

      toast.error(msg);
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center gap-2.5">
        <div className="h-9 w-20 animate-pulse rounded-xl bg-gray-200/80" />
        <div className="h-9 w-24 animate-pulse rounded-xl bg-gray-200/80" />
      </div>
    );
  }

  if (session?.user) {
    const user = session.user;

    const userInitial = user.name
      ? user.name.charAt(0).toUpperCase()
      : "ইউ";

    return (
      <div className="relative">
        {/* Profile Button */}
        <button
          type="button"
          onClick={() => setProfileOpen((prev) => !prev)}
          aria-expanded={profileOpen}
          aria-haspopup="true"
          className="flex items-center gap-2 rounded-full px-2 py-1.5 transition-all duration-200 hover:bg-gray-100"
          title="প্রোফাইল মেনু"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 text-lg font-bold text-[#039648]">
            {user.image ? (
              <img
                src={user.image}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              userInitial
            )}
          </div>

          <span className="hidden max-w-[120px] truncate text-xs font-medium text-gray-800 sm:inline sm:text-sm">
            {user.name || "প্রোফাইল"}
          </span>

          {/* Dropdown Arrow */}
          <svg
            className={`h-3 w-3 shrink-0 text-gray-500 transition-transform duration-200 ${
              profileOpen ? "rotate-180" : ""
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.09 1.03l-4.25 4.5a.75.75 0 01-1.09 0l-4.25-4.5a.75.75 0 01.02-1.05z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Profile Dropdown */}
        {profileOpen && (
          <>
            {/* Click outside to close */}
            <button
              type="button"
              aria-label="Close profile menu"
              className="fixed inset-0 z-40 cursor-default"
              onClick={() => setProfileOpen(false)}
            />

            <div className="absolute right-0 top-full z-50 mt-3 w-80 max-w-[calc(100vw-24px)] rounded-[22px] border border-gray-200/80 bg-[#fbfdfb] p-6 shadow-lg">
              {/* User Name and Email */}
              <div className="mb-5">
                <h3 className="truncate text-base font-bold text-[#27332b]">
                  {user.name || "ব্যবহারকারী"}
                </h3>

                <p className="mt-1 truncate text-sm text-gray-500">
                  {user.email}
                </p>
              </div>

              {/* My Profile */}
              <Link
                href="/profile"
                onClick={() => setProfileOpen(false)}
                className="mb-5 flex items-center gap-2 text-base text-[#27332b] transition-colors hover:text-[#078b43]"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M5 21v-2a7 7 0 0114 0v2" />
                </svg>

                <span>আমার প্রোফাইল</span>
              </Link>

              {/* Sign Out */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 text-base text-red-500 transition-colors hover:text-red-600"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <path d="M16 17l5-5-5-5" />
                  <path d="M21 12H9" />
                </svg>

                <span>সাইন আউট</span>
              </button>
            </div>
          </>
        )}
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