"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient, signIn } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = authClient.useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already logged in, redirect to home page
  useEffect(() => {
    if (!isSessionLoading && session?.user) {
      router.push("/");
    }
  }, [session, isSessionLoading, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();

    // Validations
    if (!trimmedEmail || !password) {
      const msg = "অনুগ্রহ করে ইমেইল এবং পাসওয়ার্ড প্রদান করুন।";
      setErrorMessage(msg);
      toast.warn(msg);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      const msg = "অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা প্রদান করুন।";
      setErrorMessage(msg);
      toast.warn(msg);
      return;
    }

    if (password.length < 8) {
      const msg = "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।";
      setErrorMessage(msg);
      toast.warn(msg);
      return;
    }

    setIsLoading(true);

    try {
      const res = await signIn.email({
        email: trimmedEmail,
        password,
        rememberMe: true,
        callbackURL: "/",
      });

      if (res?.error) {
        const errorText =
          res.error.message ||
          "ইমেইল বা পাসওয়ার্ড সঠিক নয়। অনুগ্রহ করে আবার চেষ্টা করুন।";
        setErrorMessage(errorText);
        toast.error(errorText);
      } else {
        toast.success("সফলভাবে সাইন ইন হয়েছে! স্বাগতম।");
        router.push("/");
        router.refresh();
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "সাইন ইন করতে সমস্যা হয়েছে।";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    setErrorMessage(null);
    setSocialLoading(provider);
    const providerName = provider === "google" ? "Google" : "GitHub";

    try {
      toast.info(`${providerName} দিয়ে লগইন করা হচ্ছে...`);
      const res = await signIn.social({
        provider,
        callbackURL: "/",
      });

      if (res?.error) {
        const msg =
          res.error.message ||
          `${providerName} লগইন সম্পন্ন করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।`;
        setErrorMessage(msg);
        toast.error(msg);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : `${providerName} লগইন ব্যর্থ হয়েছে।`;
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setSocialLoading(null);
    }
  };

  // Skeleton Loader while session is checking
  if (isSessionLoading) {
    return (
      <main className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-[#f4f8f4] px-4 py-12">
        <div className="w-full max-w-[460px] animate-pulse space-y-6 rounded-2xl bg-white p-8 shadow-sm border border-gray-100 sm:p-9">
          <div className="h-8 w-44 mx-auto rounded-lg bg-gray-200"></div>
          <div className="h-4 w-64 mx-auto rounded bg-gray-100"></div>
          <div className="space-y-4 pt-4">
            <div className="h-4 w-16 rounded bg-gray-200"></div>
            <div className="h-11 rounded-xl bg-gray-100"></div>
            <div className="h-4 w-20 rounded bg-gray-200"></div>
            <div className="h-11 rounded-xl bg-gray-100"></div>
            <div className="h-12 rounded-xl bg-emerald-200"></div>
          </div>
          <div className="h-4 w-36 mx-auto rounded bg-gray-200"></div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="h-11 rounded-xl bg-gray-100"></div>
            <div className="h-11 rounded-xl bg-gray-100"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center bg-[#f4f8f4] px-4 py-12">
      {/* Title & Subtitle */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
          সাইন ইন
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[460px] rounded-2xl bg-white p-8 shadow-sm border border-gray-100/80 sm:p-9">
        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-red-50 p-3.5 text-xs sm:text-sm text-red-700 border border-red-200">
            <svg
              className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-800 mb-1.5"
            >
              ইমেইল
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isLoading || !!socialLoading}
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition duration-150 focus:border-[#039648] focus:outline-none focus:ring-2 focus:ring-[#039648]/20 disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
          </div>

          {/* Password Field with visibility toggle */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-800 mb-1.5"
            >
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={isVisible ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="কমপক্ষে ৮ অক্ষর"
                disabled={isLoading || !!socialLoading}
                className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 pr-11 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition duration-150 focus:border-[#039648] focus:outline-none focus:ring-2 focus:ring-[#039648]/20 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
              <button
                type="button"
                onClick={() => setIsVisible(!isVisible)}
                disabled={isLoading || !!socialLoading}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1 cursor-pointer transition-colors"
                aria-label={isVisible ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
              >
                {isVisible ? (
                  // Eye Slash Icon
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                    />
                  </svg>
                ) : (
                  // Eye Icon
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !!socialLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#039648] py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#027e3c] hover:shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>সাইন ইন হচ্ছে...</span>
              </>
            ) : (
              "সাইন ইন"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="w-full border-t border-gray-200" />
          <span className="absolute bg-white px-3 text-xs font-medium text-gray-500">
            অথবা
          </span>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Google Button */}
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            disabled={isLoading || !!socialLoading}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-xs sm:text-sm font-medium text-gray-700 shadow-xs transition duration-150 hover:bg-gray-50 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {socialLoading === "google" ? (
              <span className="loading loading-spinner loading-xs text-gray-600"></span>
            ) : (
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span className="truncate">Google দিয়ে চালিয়ে যান</span>
          </button>

          {/* GitHub Button */}
          <button
            type="button"
            onClick={() => handleSocialLogin("github")}
            disabled={isLoading || !!socialLoading}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-xs sm:text-sm font-medium text-gray-700 shadow-xs transition duration-150 hover:bg-gray-50 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {socialLoading === "github" ? (
              <span className="loading loading-spinner loading-xs text-gray-600"></span>
            ) : (
              <svg className="h-4 w-4 shrink-0 fill-gray-900" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            )}
            <span className="truncate">GitHub দিয়ে চালিয়ে যান</span>
          </button>
        </div>

        {/* Link to Sign Up */}
        <div className="mt-6 text-center text-xs sm:text-sm text-gray-600">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#039648] hover:text-[#027e3c] transition-colors hover:underline"
          >
            সাইন আপ করুন
          </Link>
        </div>
      </div>

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
