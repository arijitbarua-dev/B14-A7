"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import SignUpForm from "./SignUpForm";
import SignUpSkeleton from "./SignUpSkeleton";

export default function SignUpPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // If already logged in, redirect to home page
  useEffect(() => {
    if (!isPending && session?.user) {
      router.push("/");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <main className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-[#f4f8f4] px-4 py-12">
        <SignUpSkeleton />
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center bg-[#f4f8f4] px-4 py-12">
      {/* Title & Subtitle */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
          অ্যাকাউন্ট তৈরি করুন
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
        </p>
      </div>

      {/* Main Registration Form Card */}
      <SignUpForm />

      {/* Return to Home link */}
      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors inline-flex items-center gap-1.5"
        >
          <span>←</span> হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}
