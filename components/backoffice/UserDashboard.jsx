import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Package, 
  CreditCard, 
  Truck, 
  ShoppingBag, 
  Clock, 
  ChevronRight, 
  AlertCircle,
  MapPin,
  ExternalLink
} from "lucide-react";
import { convertIsoDateToNormal } from "@/lib/convertIsoDatetoNormal";

export default function UserDashboard({ orders = [], session = {} }) {
  const userName = session?.user?.name || "Shopper";
  const userEmail = session?.user?.email || "";

  // Filter orders for this customer
  const myOrders = Array.isArray(orders) ? orders : [];
  const pendingPaymentOrders = myOrders.filter(
    (o) => o.paymentStatus !== "PAID"
  );
  const completedOrders = myOrders.filter(
    (o) => o.paymentStatus === "PAID"
  );

  const totalSpent = completedOrders.reduce((sum, order) => {
    const itemsTotal = (order.orderItems || []).reduce(
      (acc, i) => acc + (i.price * i.quantity),
      0
    );
    return sum + itemsTotal + (order.shippingCost || 0);
  }, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-green-400 bg-green-950/60 px-3 py-1 rounded-full border border-green-800">
              Shopper Account
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-3">
              Welcome back, {userName}!
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Track your deliveries, manage pending payments, and view your orders in one place.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition text-sm shadow"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Unpaid Order Alert */}
      {pendingPaymentOrders.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                You have {pendingPaymentOrders.length} order{pendingPaymentOrders.length > 1 ? "s" : ""} awaiting payment
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Complete payment via M-Pesa to confirm your order and begin shipping.
              </p>
            </div>
          </div>
          <Link
            href={`/order-confirmation/${pendingPaymentOrders[0].id}`}
            className="whitespace-nowrap px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition"
          >
            Pay Order #{pendingPaymentOrders[0].orderNumber}
          </Link>
        </div>
      )}

      {/* Shopper Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Total Orders
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black mt-2 text-slate-900 dark:text-slate-100">
            {myOrders.length}
          </p>
          <Link
            href="/dashboard/orders"
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-flex items-center gap-1 font-medium"
          >
            View all orders <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Pending Payment
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black mt-2 text-slate-900 dark:text-slate-100">
            {pendingPaymentOrders.length}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Awaiting M-Pesa confirmation
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Total Purchases
            </span>
            <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black mt-2 text-slate-900 dark:text-slate-100">
            KSh {totalSpent.toLocaleString("en-KE", { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Across {completedOrders.length} paid order{completedOrders.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Recent Orders
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your latest purchases and tracking details
            </p>
          </div>
          <Link
            href="/dashboard/orders"
            className="text-xs font-semibold text-slate-900 dark:text-slate-100 hover:underline flex items-center gap-1"
          >
            All Orders <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {myOrders.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Package className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              No orders placed yet
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-5">
              Explore thousands of products from trusted Kenyan sellers and place your first order!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {myOrders.slice(0, 5).map((order) => {
              const orderTotal = (order.orderItems || []).reduce(
                (sum, i) => sum + i.price * i.quantity,
                0
              ) + (order.shippingCost || 0);

              const isPaid = order.paymentStatus === "PAID";

              return (
                <div key={order.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                        #{order.orderNumber}
                      </span>
                      <span className="text-xs text-slate-400">
                        {convertIsoDateToNormal(order.createdAt)}
                      </span>
                      {isPaid ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300">
                          PAID
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          PENDING PAYMENT
                        </span>
                      )}
                    </div>

                    {/* Order Items Preview */}
                    <div className="flex items-center gap-2 overflow-x-auto py-1">
                      {(order.orderItems || []).slice(0, 4).map((item, idx) => (
                        <div key={idx} className="flex-shrink-0 relative group" title={item.title}>
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs text-slate-400">
                              Item
                            </div>
                          )}
                        </div>
                      ))}
                      {(order.orderItems || []).length > 4 && (
                        <span className="text-xs text-slate-500 font-semibold pl-1">
                          +{(order.orderItems || []).length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0">
                    <div className="text-left md:text-right">
                      <p className="text-xs text-slate-400 uppercase tracking-wider">Total</p>
                      <p className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                        KSh {orderTotal.toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isPaid && (
                        <Link
                          href={`/order-confirmation/${order.id}`}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition"
                        >
                          Pay Now
                        </Link>
                      )}
                      <Link
                        href={`/dashboard/orders/${order.id}/invoice`}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg transition"
                      >
                        Invoice
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Account Settings & Shipping Quick Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Default Shipping Address
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Keep your delivery location updated for faster checkout
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/profile"
            className="inline-block mt-2 text-xs font-bold text-slate-900 dark:text-green-400 hover:underline"
          >
            Manage Addresses & Profile →
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Sell on Meed Collections
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Are you a merchant? Open a verified seller storefront today
              </p>
            </div>
          </div>
          <Link
            href="/sell"
            className="inline-block mt-2 text-xs font-bold text-slate-900 dark:text-green-400 hover:underline"
          >
            Apply for a Vendor Account →
          </Link>
        </div>
      </div>
    </div>
  );
}
