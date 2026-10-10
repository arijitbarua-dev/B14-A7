"use client";

import React from "react";

export default function SignUpSkeleton() {
  return (
    <div className="w-full max-w-[460px] animate-pulse space-y-5 rounded-2xl bg-white p-8 shadow-sm border border-gray-100 sm:p-9">
      {/* Title skeleton */}
      <div className="space-y-2 text-center">
        <div className="h-8 w-52 mx-auto rounded-lg bg-gray-200"></div>
        <div className="h-4 w-64 mx-auto rounded bg-gray-100"></div>
      </div>

      {/* Input fields skeleton */}
      <div className="space-y-3.5 pt-2">
        <div className="space-y-1.5">
          <div className="h-4 w-16 rounded bg-gray-200"></div>
          <div className="h-10 rounded-xl bg-gray-100"></div>
        </div>
        <div className="space-y-1.5">
          <div className="h-4 w-16 rounded bg-gray-200"></div>
          <div className="h-10 rounded-xl bg-gray-100"></div>
        </div>
        <div className="space-y-1.5">
          <div className="h-4 w-20 rounded bg-gray-200"></div>
          <div className="h-10 rounded-xl bg-gray-100"></div>
        </div>
        <div className="space-y-1.5">
          <div className="h-4 w-28 rounded bg-gray-200"></div>
          <div className="h-10 rounded-xl bg-gray-100"></div>
        </div>
        <div className="h-12 rounded-xl bg-emerald-200/80 mt-1"></div>
      </div>

      {/* Divider */}
      <div className="h-4 w-28 mx-auto rounded bg-gray-100"></div>

      {/* Social buttons skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="h-11 rounded-xl bg-gray-100"></div>
        <div className="h-11 rounded-xl bg-gray-100"></div>
      </div>

      {/* Footer link skeleton */}
      <div className="h-4 w-40 mx-auto rounded bg-gray-100"></div>
    </div>
  );
}
