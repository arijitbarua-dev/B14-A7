"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { signUp } from "@/lib/auth-client";
import SocialSignUp from "./SocialSignUp";

export default function SignUpForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    // Form Validations
    if (!trimmedName) {
      const msg = "অনুগ্রহ করে আপনার নাম লিখুন।";
      setErrorMessage(msg);
      toast.warn(msg);
      return;
    }

    if (!trimmedEmail) {
      const msg = "অনুগ্রহ করে ইমেইল ঠিকানা দিন।";
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

    if (!password) {
      const msg = "অনুগ্রহ করে পাসওয়ার্ড প্রদান করুন।";
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

    if (password !== confirmPassword) {
      const msg = "পাসওয়ার্ড দুটি মিলছে না। অনুগ্রহ করে যাচাই করুন।";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    setIsLoading(true);

    try {
      const res = await signUp.email({
        name: trimmedName,
        email: trimmedEmail,
        password,
      });

      if (res?.error) {
        const errorText =
          res.error.message ||
          "নিবন্ধন সম্পন্ন করা যায়নি। এই ইমেইলে ইতোমধ্যে অ্যাকাউন্ট থাকতে পারে।";
        setErrorMessage(errorText);
        toast.error(errorText);
      } else {
        toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! অনুগ্রহ করে সাইন ইন করুন।");
        // Navigating to Login Page as specified
        router.push("/signin");
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "নিবন্ধন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
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

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label
            htmlFor="signup-name"
            className="block text-sm font-semibold text-gray-800 mb-1.5"
          >
            নাম
          </label>
          <input
            id="signup-name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="যেমন: রহিম উদ্দিন"
            disabled={isLoading}
            className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition duration-150 focus:border-[#039648] focus:outline-none focus:ring-2 focus:ring-[#039648]/20 disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
          />
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="signup-email"
            className="block text-sm font-semibold text-gray-800 mb-1.5"
          >
            ইমেইল
          </label>
          <input
            id="signup-email"
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
            htmlFor="signup-password"
            className="block text-sm font-semibold text-gray-800 mb-1.5"
          >
            পাসওয়ার্ড
          </label>
          <div className="relative">
            <input
              id="signup-password"
              name="password"
              type={isPasswordVisible ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="কমপক্ষে ৮ অক্ষর"
              disabled={isLoading}
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 pr-11 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition duration-150 focus:border-[#039648] focus:outline-none focus:ring-2 focus:ring-[#039648]/20 disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              disabled={isLoading}
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1 cursor-pointer transition-colors"
              aria-label={isPasswordVisible ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
            >
              {isPasswordVisible ? (
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

        {/* Confirm Password Field with visibility toggle */}
        <div>
          <label
            htmlFor="signup-confirmPassword"
            className="block text-sm font-semibold text-gray-800 mb-1.5"
          >
            পাসওয়ার্ড নিশ্চিত করুন
          </label>
          <div className="relative">
            <input
              id="signup-confirmPassword"
              name="confirmPassword"
              type={isConfirmPasswordVisible ? "text" : "password"}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="আবার লিখুন"
              disabled={isLoading}
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 pr-11 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition duration-150 focus:border-[#039648] focus:outline-none focus:ring-2 focus:ring-[#039648]/20 disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
            <button
              type="button"
              onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
              disabled={isLoading}
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1 cursor-pointer transition-colors"
              aria-label={isConfirmPasswordVisible ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
            >
              {isConfirmPasswordVisible ? (
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
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#039648] py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#027e3c] hover:shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer mt-2"
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
              <span>নিবন্ধন হচ্ছে...</span>
            </>
          ) : (
            "অ্যাকাউন্ট তৈরি করুন"
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
      <SocialSignUp disabled={isLoading} />

      {/* Link to Sign In */}
      <div className="mt-6 text-center text-xs sm:text-sm text-gray-600">
        অ্যাকাউন্ট আছে?{" "}
        <Link
          href="/signin"
          className="font-semibold text-[#039648] hover:text-[#027e3c] transition-colors hover:underline"
        >
          সাইন ইন করুন
        </Link>
      </div>
    </div>
  );
}
