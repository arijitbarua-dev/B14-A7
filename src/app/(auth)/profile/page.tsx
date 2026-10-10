"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession, updateUser, signOut } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.info("প্রোফাইল দেখতে অনুগ্রহ করে সাইন ইন করুন।");
      router.push("/signin");
    }
  }, [session, isPending, router]);

  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedName = formData.get("name")?.toString().trim();

    if (!updatedName) {
      toast.warn("অনুগ্রহ করে একটি নাম লিখুন।");
      return;
    }

    setIsUpdating(true);

    try {
      const res = await updateUser({
        name: updatedName,
      });

      if (res?.error) {
        toast.error(res.error.message || "নাম পরিবর্তন করা সম্ভব হয়নি।");
      } else {
        toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে!");
        router.refresh();
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "প্রোফাইল আপডেট করতে সমস্যা হয়েছে।";
      toast.error(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("সফলভাবে লগআউট হয়েছে!");
      router.push("/signin");
      router.refresh();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "লগআউট করতে সমস্যা হয়েছে।";
      toast.error(msg);
    }
  };

  if (isPending) {
    return (
      <main className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-[#f4f8f4] px-4 py-12">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-sm border border-gray-100 animate-pulse space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gray-200"></div>
            <div className="space-y-2 flex-1">
              <div className="h-5 w-40 rounded bg-gray-200"></div>
              <div className="h-4 w-52 rounded bg-gray-100"></div>
            </div>
          </div>
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="h-4 w-28 rounded bg-gray-200"></div>
            <div className="h-10 rounded-xl bg-gray-100"></div>
          </div>
          <div className="h-11 rounded-xl bg-gray-200"></div>
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user;
  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : "ইউ";

  return (
    <main className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center bg-[#f4f8f4] px-4 py-12">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
          আপনার প্রোফাইল
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          আপনার অ্যাকাউন্ট বিবরণ দেখুন এবং আপডেট করুন
        </p>
      </div>

      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-sm border border-gray-100 sm:p-9">
        {/* User Card Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#039648] text-white text-2xl font-bold shadow-xs">
            {userInitial}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{user.name || "ব্যবহারকারী"}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mt-1">
              সক্রিয় অ্যাকাউন্ট
            </span>
          </div>
        </div>

        {/* Update Form */}
        <form onSubmit={handleUpdateUser} className="py-6 space-y-4">
          <div>
            <label
              htmlFor="profile-name"
              className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1"
            >
              আপনার নাম
            </label>
            <div className="flex gap-2">
              <input
                id="profile-name"
                name="name"
                type="text"
                defaultValue={user.name || ""}
                key={user.name || "user"}
                placeholder="আপনার নাম লিখুন"
                disabled={isUpdating}
                className="flex-1 rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition duration-150 focus:border-[#039648] focus:outline-none focus:ring-2 focus:ring-[#039648]/20 disabled:bg-gray-100"
                required
              />
              <button
                type="submit"
                disabled={isUpdating}
                className="flex items-center gap-1.5 rounded-xl bg-[#039648] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#027e3c] active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
                title="পরিবর্তন সংরক্ষণ করুন"
              >
                {/* Save Icon (FloppyDisk) */}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                <span>{isUpdating ? "সংরক্ষণ..." : "সংরক্ষণ"}</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              ইমেইল ঠিকানা (পরিবর্তনযোগ্য নয়)
            </label>
            <div className="text-sm font-medium text-gray-700 bg-gray-50 px-3.5 py-2.5 rounded-xl border border-gray-100">
              {user.email}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              অ্যাকাউন্ট আইডি
            </label>
            <div className="text-xs font-mono text-gray-500 bg-gray-50 px-3.5 py-2.5 rounded-xl border border-gray-100 truncate">
              {user.id}
            </div>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3 border-t border-gray-100">
          <Link
            href="/"
            className="flex-1 text-center rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-700 shadow-xs hover:bg-gray-50 active:scale-95 transition-all"
          >
            হোম পেজে যান
          </Link>

          <button
            onClick={handleLogout}
            className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-red-700 active:scale-95 transition-all cursor-pointer"
          >
            লগআউট করুন
          </button>
        </div>
      </div>
    </main>
  );
}
