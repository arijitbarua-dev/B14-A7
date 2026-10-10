"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { signIn } from "@/lib/auth-client";
import SocialSignIn from "./SocialSignIn";

export default function SignInForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  return (
    <div className="w-full max-w-[460px] rounded-2xl bg-white p-8 shadow-sm border border-gray-100/80 sm:p-9">
      {/* Inline Error Alert */}
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

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label
            htmlFor="signin-email"
            className="block text-sm font-semibold text-gray-800 mb-1.5"
          >
            ইমেইল
          </label>
          <input
            id="signin-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={isLoading}
            className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition duration-150 focus:border-[#039648] focus:outline-none focus:ring-2 focus:ring-[#039648]/20 disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
          />
        </div>

        {/* Password Field with visibility toggle */}
        <div>
          <label
            htmlFor="signin-password"
            className="block text-sm font-semibold text-gray-800 mb-1.5"
          >
            পাসওয়ার্ড
          </label>
          <div className="relative">
            <input
              id="signin-password"
              name="password"
              type={isVisible ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="কমপক্ষে ৮ অক্ষর"
              disabled={isLoading}
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 pr-11 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition duration-150 focus:border-[#039648] focus:outline-none focus:ring-2 focus:ring-[#039648]/20 disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
            <button
              type="button"
              onClick={() => setIsVisible(!isVisible)}
              disabled={isLoading}
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
          disabled={isLoading}
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

      {/* Social Logins */}
      <SocialSignIn disabled={isLoading} />

      {/* Link to Register */}
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
  );
}
