import { convertIsoDateToNormal } from "@/lib/convertIsoDatetoNormal";
import { generateSlug } from "@/lib/generateSlug";
import Link from "next/link";
import React from "react";

export default function OrderCard({ order }) {
  const orderCreationDate = convertIsoDateToNormal(order.createdAt);
  const itemsTotal = order?.orderItems
    ? order.orderItems.reduce((total, item) => total + item.price * item.quantity, 0)
    : 0;
  const shippingCost = Number(order?.shippingCost || 0);
  const grandTotal = itemsTotal + shippingCost;
  const formattedTotal = grandTotal.toLocaleString("en-KE", { minimumFractionDigits: 2 });

  const paymentStatus = order.paymentStatus || "PENDING";
  const isPaid = paymentStatus === "PAID";

  if (!order.orderItems || order.orderItems.length === 0) {
    return null;
  }

  return (
    <li className="overflow-hidden bg-white border border-gray-200 rounded-md">
      <div className="lg:flex">
        <div className="w-full border-b border-gray-200 lg:max-w-xs lg:border-b-0 lg:border-r bg-gray-50">
          <div className="px-4 py-6 sm:p-6 lg:p-8">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-1">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Order Number
                </p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">
                  #{order.orderNumber}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">
                  {orderCreationDate}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Amount
                </p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">
                  KSh {formattedTotal}
                </p>
                {shippingCost > 0 && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    (incl. KSh {shippingCost} delivery)
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Payment Status
                </p>
                <div className="mt-1">
                  {isPaid ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      PAID
                    </span>
                  ) : paymentStatus === "FAILED" ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                      FAILED
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                      PENDING PAYMENT
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Fulfillment
                </p>
                <div className="mt-0.5 flex items-center">
                  <span className="text-sm font-bold text-gray-900">
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-6 sm:p-6 lg:p-8">
          <ul className="divide-y divide-gray-100">
            {order.orderItems.map((item, i) => {
              const slug = generateSlug(item.title);
              const formattedPrice = Number(item.price || 0).toLocaleString("en-KE");
              return (
                <li key={i} className="relative flex py-4 first:pt-0 last:pb-0">
                  <div className="flex-shrink-0">
                    <img
                      className="object-cover rounded-lg w-20 h-20"
                      src={item.imageUrl}
                      alt={item.title}
                    />
                  </div>

                  <div className="flex flex-col justify-between flex-1 ml-5">
                    <div className="sm:grid sm:grid-cols-2 sm:gap-x-5">
                      <div>
                        <p className="text-base font-bold text-gray-900">
                          {item.title}
                        </p>
                      </div>

                      <div className="mt-2 sm:mt-0 flex items-center justify-between sm:justify-end gap-4">
                        <p className="text-sm font-medium text-gray-500">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-base font-bold text-gray-900">
                          KSh {formattedPrice}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Link
                        href={`/products/${slug}`}
                        title={item.title}
                        className="text-xs font-medium text-slate-600 hover:text-slate-900 hover:underline"
                      >
                        View Product
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <hr className="mt-8 border-gray-200" />

          <div className="flex flex-wrap items-center mt-6 gap-3">
            {!isPaid && (
              <Link
                href={`/order-confirmation/${order.id}`}
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 bg-slate-900 rounded-md hover:bg-slate-800 shadow-sm"
              >
                Pay Now (M-Pesa / Card)
              </Link>
            )}

            <Link
              href={`/order-confirmation/${order.id}`}
              className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-200 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Order Details
            </Link>

            <Link
              href={`/dashboard/orders/${order.id}/invoice`}
              className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-200 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              View Invoice
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
}
