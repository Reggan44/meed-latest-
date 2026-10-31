import { Boxes, CircleDollarSign, ShoppingCart, AlertTriangle } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function OverviewCards({ sales = [], products = [] }) {
  const productsCount = products.length.toString().padStart(2, "0");
  const salesCount = sales.length.toString().padStart(2, "0");
  const totalSales = sales.reduce((acc, item) => acc + (item.total || 0), 0);
  
  const lowStockCount = products
    .filter((p) => p.productStock !== null && p.productStock <= 5)
    .length.toString().padStart(2, "0");

  const analytics = [
    {
      title: "Listed Products",
      count: productsCount,
      link: "/dashboard/products",
      icon: Boxes,
      iconBg: "bg-blue-600 text-white dark:bg-blue-900 dark:text-blue-200",
    },
    {
      title: "Units Sold",
      count: salesCount,
      link: "/dashboard/sales",
      icon: ShoppingCart,
      iconBg: "bg-purple-600 text-white dark:bg-purple-900 dark:text-purple-200",
    },
    {
      title: "Gross Store Revenue",
      count: `KSh ${totalSales.toLocaleString("en-KE", { maximumFractionDigits: 0 })}`,
      link: "/dashboard/wallet",
      icon: CircleDollarSign,
      iconBg: "bg-green-600 text-white dark:bg-green-900 dark:text-green-200",
    },
    {
      title: "Low Stock Warnings",
      count: lowStockCount,
      link: "/dashboard/products",
      icon: AlertTriangle,
      iconBg: "bg-amber-600 text-white dark:bg-amber-900 dark:text-amber-200",
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {analytics.map((item, i) => {
        const Icon = item.icon;
        return (
          <div
            key={i}
            className="flex flex-col bg-white border border-slate-200 shadow-sm rounded-2xl dark:bg-slate-900 dark:border-slate-800"
          >
            <div className="p-4 md:p-5 flex justify-between gap-x-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                  {item.title}
                </p>
                <div className="mt-1 flex items-center gap-x-2">
                  <h3 className="mt-1 text-2xl font-black text-slate-900 dark:text-slate-100">
                    {item.count}
                  </h3>
                </div>
              </div>
              <div
                className={`flex-shrink-0 flex justify-center items-center w-11 h-11 rounded-xl ${item.iconBg}`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <Link
              href={item.link}
              className="py-3 px-4 md:px-5 inline-flex justify-between items-center text-xs font-semibold rounded-b-2xl border-t border-slate-100 dark:border-slate-800 text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 transition"
            >
              View Details →
            </Link>
          </div>
        );
      })}
    </div>
  );
}
