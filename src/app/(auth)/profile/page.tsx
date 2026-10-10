"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession, authClient } from "@/lib/auth-client";
import Image from "next/image";

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

  const handleUpdateUser = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const updatedName = formData.get("name")?.toString().trim();

    if (!updatedName) {
      toast.warn("অনুগ্রহ করে একটি নাম লিখুন।");
      return;
    }

    setIsUpdating(true);

    try {
      const res = await authClient.updateUser({
        name: updatedName,
      });

      if (res?.error) {
        toast.error(
          res.error.message || "নাম পরিবর্তন করা সম্ভব হয়নি।"
        );
      } else {
        toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে!");
        router.refresh();
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "প্রোফাইল আপডেট করতে সমস্যা হয়েছে.";

      toast.error(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isPending) {
    return (
      <main className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-[#f0f5f1] px-4 py-12">
        <div className="w-full max-w-lg space-y-5 animate-pulse">
          <div className="space-y-2">
            <div className="h-6 w-36 rounded bg-gray-200" />
            <div className="h-3 w-52 rounded bg-gray-100" />
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white/80 p-4">
            <div className="h-12 w-12 rounded-xl bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="h-3 w-40 rounded bg-gray-100" />
            </div>
          </div>

          <div className="space-y-5 rounded-xl border border-gray-200 bg-white/80 p-5">
            <div className="h-4 w-16 rounded bg-gray-200" />
            <div className="h-3 w-12 rounded bg-gray-100" />
            <div className="h-8 rounded-lg bg-gray-100" />
            <div className="h-7 rounded-md bg-gray-200" />
          </div>
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user;

  const userInitial = user.name
    ? user.name.charAt(0).toUpperCase()
    : "ইউ";

  return (
    <main className="min-h-[calc(100vh-140px)] bg-[#f0f5f1] px-4 py-12 sm:py-20">
      <div className="mx-auto w-full max-w-lg">
        {/* Page Heading */}
        <div className="mb-5">
          <h1 className="text-xl font-extrabold tracking-tight text-gray-900">
            আমার প্রোফাইল
          </h1>

          <p className="mt-1 text-xs text-gray-500">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন
          </p>
        </div>

        {/* User Information Card */}
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-gray-200/80 bg-white/80 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 text-lg font-bold text-[#039648]">
            {user.image ? (
              <Image
                src={user.image}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              userInitial
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-bold text-gray-900">
              {user.name || "ব্যবহারকারী"}
            </h2>

            <p className="truncate text-xs text-gray-500">
              {user.email}
            </p>
          </div>
        </div>

        {/* Profile Update Card */}
        <div className="rounded-xl border border-gray-200/80 bg-white/80 p-4 sm:p-5">
          <h2 className="mb-6 text-sm font-semibold text-gray-900">
            তথ্য
          </h2>

          <form onSubmit={handleUpdateUser} className="space-y-3">
            <div>
              <label
                htmlFor="profile-name"
                className="mb-1 block text-xs font-medium text-gray-700"
              >
                নাম
              </label>

              <input
                id="profile-name"
                name="name"
                type="text"
                defaultValue={user.name || ""}
                key={user.name || "user"}
                placeholder="আপনার নাম লিখুন"
                disabled={isUpdating}
                required
                className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#039648] focus:ring-2 focus:ring-[#039648]/10 disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full rounded-md bg-[#078b43] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#067638] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUpdating ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}