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
  const money = (n) => `Ksh. ${n.toLocaleString("en-KE", { minimumFractionDigits: 2 })}`;
  return (
    <div>
      <Heading title="Wallet" />
      <div className="max-w-xl rounded-lg bg-white dark:bg-slate-800 p-6 shadow">
        <p className="text-slate-500 dark:text-slate-400">
          {isAdmin ? "Total platform sales" : "Your total sales"}
        </p>
        <p className="text-3xl font-bold mt-1">{money(total)}</p>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          {sales.length} sale{sales.length === 1 ? "" : "s"} recorded. Payouts
          are not enabled yet.
        </p>
      </div>
    </div>
  );
}
