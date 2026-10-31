import React from "react";
import Link from "next/link";
import { Users2, UserSquare2, AlertCircle, Boxes } from "lucide-react";

export default function AdminPlatformCards({
  customersCount = 0,
  vendorsCount = 0,
  pendingVendorsCount = 0,
  productsCount = 0,
}) {
  return (
    <div className="space-y-4 mb-6">
      {pendingVendorsCount > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                {pendingVendorsCount} new seller application{pendingVendorsCount === 1 ? "" : "s"} waiting for approval
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Review merchant documents and approve businesses to start listing items on Meed.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/vendors"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition"
          >
            Review Sellers
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">
              Registered Shoppers
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Users2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black mt-2 text-slate-900 dark:text-slate-100">
            {customersCount}
          </p>
          <Link
            href="/dashboard/customers"
            className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline mt-2 inline-block"
          >
            View customer directory →
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">
              Active Businesses (Sellers)
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <UserSquare2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black mt-2 text-slate-900 dark:text-slate-100">
            {vendorsCount}
          </p>
          <Link
            href="/dashboard/vendors"
            className="text-xs text-purple-600 dark:text-purple-400 font-semibold hover:underline mt-2 inline-block"
          >
            Manage store profiles →
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">
              Pending Approvals
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black mt-2 text-slate-900 dark:text-slate-100">
            {pendingVendorsCount}
          </p>
          <Link
            href="/dashboard/vendors"
            className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline mt-2 inline-block"
          >
            Review applications →
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">
              Listed Products
            </span>
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black mt-2 text-slate-900 dark:text-slate-100">
            {productsCount}
          </p>
          <Link
            href="/dashboard/products"
            className="text-xs text-green-600 dark:text-green-400 font-semibold hover:underline mt-2 inline-block"
          >
            View marketplace catalog →
          </Link>
        </div>
      </div>
    </div>
  );
}

