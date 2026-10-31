import Heading from "@/components/backoffice/Heading";
import { authOptions } from "@/lib/authOptions";
import { getData } from "@/lib/getData";
import { getServerSession } from "next-auth";
import React from "react";

export default async function Wallet() {
  const session = await getServerSession(authOptions);
  const salesRaw = await getData("sales");
  const allSales = Array.isArray(salesRaw) ? salesRaw : [];
  const isAdmin = ["ADMIN", "MODERATOR"].includes(session?.user?.role);
  const sales = isAdmin
    ? allSales
    : allSales.filter((sale) => sale.vendorId === session?.user?.id);
  const total = sales.reduce((acc, sale) => acc + (sale.total ?? 0), 0);
  const money = (n) => `KSh ${n.toLocaleString("en-KE", { minimumFractionDigits: 2 })}`;
  return (
    <div>
      <Heading title="Wallet & Earnings" />
      <div className="max-w-xl rounded-lg bg-white dark:bg-slate-800 p-6 shadow border border-slate-200 dark:border-slate-700 mt-4">
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          {isAdmin ? "Total Platform Paid Sales" : "Your Total Paid Sales"}
        </p>
        <p className="text-3xl font-extrabold mt-1 text-slate-900 dark:text-slate-100">{money(total)}</p>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          {sales.length} completed sale{sales.length === 1 ? "" : "s"} recorded from paid orders.
        </p>
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-md">
          <span>Automated M-Pesa vendor payouts are being finalized.</span>
          <span className="font-semibold uppercase tracking-wider text-[10px] bg-amber-200 dark:bg-amber-900 px-2 py-0.5 rounded">Coming Soon</span>
        </div>
      </div>
    </div>
  );
}
