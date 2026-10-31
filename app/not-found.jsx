import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-16 bg-slate-50 dark:bg-slate-950 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <span className="text-6xl font-black text-slate-300 dark:text-slate-700 tracking-wider">
          404
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-4xl">
          Page not found
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400">
          Sorry, we couldn&apos;t find the product or page you were looking for. It may have been moved or is no longer available.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition dark:bg-green-600 dark:hover:bg-green-500"
          >
            Back to Storefront
          </Link>
          <Link
            href="/cart"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
          >
            View Cart
          </Link>
        </div>
      </div>
    </div>
  );
}

