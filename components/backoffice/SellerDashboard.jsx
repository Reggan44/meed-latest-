import React from "react";
import OverviewCards from "./Seller/OverviewCards";
import { authOptions } from "@/lib/authOptions";
import { getData } from "@/lib/getData";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { 
  Info, 
  AlertTriangle, 
  TrendingUp, 
  PlusCircle, 
  Boxes, 
  ShoppingBag, 
  CheckCircle2, 
  DollarSign 
} from "lucide-react";

export default async function SellerDashboard() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const { name, email, id, role, status = false } = user || {};

  const salesRaw = await getData("sales");
  const sales = Array.isArray(salesRaw) ? salesRaw : [];
  const salesById = sales.filter((sale) => sale.vendorId === id);

  const productsRaw = await getData("products");
  const products = Array.isArray(productsRaw) ? productsRaw : [];
  const productsById = products.filter((product) => product.userId === id);

  if (!status) {
    return (
      <div className="max-w-3xl mx-auto min-h-[60vh] mt-8 space-y-6">
        <div className="p-6 text-amber-900 border border-amber-300 rounded-2xl bg-amber-50 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-200 dark:bg-amber-900 rounded-xl">
              <Info className="w-6 h-6 text-amber-800 dark:text-amber-200" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Seller Application Under Review</h3>
              <p className="mt-2 text-sm text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                Thank you for applying to sell on Meed Collections! Our merchant compliance team is verifying your business details.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-200/80 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200">
                  Status: Verification in Progress
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Store: {name || email}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-2">
            What happens next?
          </h4>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>We check store details and contact information.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>Once approved by Meed Admin, product listing and inventory tools will unlock automatically.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>You will receive payouts directly via M-Pesa for completed orders.</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  // Calculate Strengths & Weaknesses / Inventory Health
  const lowStockProducts = productsById.filter(
    (p) => p.productStock !== null && p.productStock > 0 && p.productStock <= 5
  );
  const outOfStockProducts = productsById.filter(
    (p) => p.productStock !== null && p.productStock <= 0
  );

  // Group sales by product to find Top Sellers
  const salesByProduct = {};
  for (const sale of salesById) {
    if (!salesByProduct[sale.productId]) {
      salesByProduct[sale.productId] = {
        title: sale.productTitle,
        image: sale.productImage,
        unitsSold: 0,
        revenue: 0,
      };
    }
    salesByProduct[sale.productId].unitsSold += (sale.productQty || 1);
    salesByProduct[sale.productId].revenue += (sale.total || 0);
  }
  const topProducts = Object.values(salesByProduct)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Top Welcome & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <span className="text-xs font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900">
            Verified Merchant
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">
            {name}&apos;s Seller Center
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your inventory, monitor sales performance, and identify store growth opportunities.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/products/new"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition"
          >
            <PlusCircle className="w-4 h-4" />
            Add New Product
          </Link>
          <Link
            href="/dashboard/wallet"
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-sm px-4 py-2.5 rounded-xl transition"
          >
            Wallet & Payouts
          </Link>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <OverviewCards sales={salesById} products={productsById} />

      {/* Strengths & Weaknesses / Merchant Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Weaknesses / Action Alerts */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Inventory Alerts & Weaknesses
              </h2>
            </div>
            <Link
              href="/dashboard/products"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Manage Stock
            </Link>
          </div>

          {outOfStockProducts.length === 0 && lowStockProducts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Healthy Inventory Levels
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                All your listed products currently have sufficient stock.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {outOfStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.imageUrl || "/placeholder.png"}
                      alt={p.title}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                        {p.title}
                      </p>
                      <p className="text-[11px] text-red-600 dark:text-red-400 font-semibold">
                        Sold out (0 stock) - Customer orders blocked
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/products/update/${p.id}`}
                    className="text-xs font-bold px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                  >
                    Restock
                  </Link>
                </div>
              ))}

              {lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.imageUrl || "/placeholder.png"}
                      alt={p.title}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                        {p.title}
                      </p>
                      <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                        Low stock warning: Only {p.productStock} left!
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/products/update/${p.id}`}
                    className="text-xs font-bold px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition"
                  >
                    Update
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Strengths / Best Selling Products */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Top Performing Products (Strengths)
              </h2>
            </div>
            <Link
              href="/dashboard/sales"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Sales Log
            </Link>
          </div>

          {topProducts.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                No Sales Data Yet
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Completed purchases of your items will rank here automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-sm text-slate-400 w-4 text-center">
                      #{idx + 1}
                    </span>
                    {p.image && (
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                        {p.title}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {p.unitsSold} unit{p.unitsSold === 1 ? "" : "s"} sold
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-green-600 dark:text-green-400">
                      KSh {p.revenue.toLocaleString("en-KE")}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
