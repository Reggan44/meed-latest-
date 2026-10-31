import Link from "next/link";
import React from "react";

export default function CartSubTotalCard({ subTotal }) {
  const formattedSubtotal = Number(subTotal || 0).toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="md:col-span-4 col-span-full sm:block bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-700 text-slate-800 overflow-hidden p-5 dark:text-slate-100 font-bold">
      <h2 className="text-2xl pb-3 border-b border-slate-500">Cart Summary</h2>

      <div className="py-4 border-b border-slate-500/40 space-y-3 font-normal text-sm">
        <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            KSh {formattedSubtotal}
          </span>
        </div>
        <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
          <span>Shipping</span>
          <span className="italic">Calculated at checkout</span>
        </div>
      </div>

      <div className="flex items-center justify-between py-4 font-bold text-lg">
        <span>Estimated Total</span>
        <span>KSh {formattedSubtotal}</span>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mb-4">
        Shipping fees (KSh 200, 350 or 500) will be added at checkout based on your selected delivery speed.
      </p>

      <div className="mt-4">
        <Link
          href="/checkout"
          className="block w-full rounded-lg bg-slate-900 px-6 py-3 text-center font-normal text-slate-50 dark:bg-green-600 hover:bg-slate-800 transition"
        >
          Continue to Checkout
        </Link>
      </div>
    </div>
  );
}
