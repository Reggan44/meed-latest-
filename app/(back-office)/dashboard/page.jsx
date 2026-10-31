import React from "react";
import DashboardCharts from "@/components/backoffice/DashboardCharts";
import SellerDashboard from "@/components/backoffice/SellerDashboard";
import Heading from "@/components/backoffice/Heading";
import LargeCards from "@/components/backoffice/LargeCards";
import SmallCards from "@/components/backoffice/SmallCards";
import UserDashboard from "@/components/backoffice/UserDashboard";
import AdminPlatformCards from "@/components/backoffice/AdminPlatformCards";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import db from "@/lib/db";

export default async function page() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  const userId = session?.user?.id;

  // 1. Shopper / Consumer Flow
  if (role === "USER") {
    let customerOrders = [];
    if (userId) {
      customerOrders = await db.order.findMany({
        where: { userId },
        include: { orderItems: true },
        orderBy: { createdAt: "desc" },
      }).catch(() => []);
    }
    return <UserDashboard orders={customerOrders} session={session} />;
  }

  // 2. Business / Merchant Flow
  if (role === "VENDOR") {
    return <SellerDashboard />;
  }

  // 3. Platform Super Admin Flow
  const [
    sales, 
    orders, 
    customersCount, 
    vendorsCount, 
    pendingVendorsCount, 
    productsCount
  ] = await Promise.all([
    db.sale.findMany({ orderBy: { createdAt: "desc" } }).catch(() => []),
    db.order.findMany({ include: { orderItems: true }, orderBy: { createdAt: "desc" } }).catch(() => []),
    db.user.count({ where: { role: "USER" } }).catch(() => 0),
    db.user.count({ where: { role: "VENDOR", status: true } }).catch(() => 0),
    db.user.count({ where: { role: "VENDOR", status: false } }).catch(() => 0),
    db.product.count().catch(() => 0),
  ]);

  return (
    <div className="space-y-6">
      <Heading title="Meed Platform Admin Overview" />

      {/* High-level Marketplace Audience (Shoppers, Sellers, Inventory) */}
      <AdminPlatformCards
        customersCount={customersCount}
        vendorsCount={vendorsCount}
        pendingVendorsCount={pendingVendorsCount}
        productsCount={productsCount}
      />

      {/* Financial GMV & Sales Metrics */}
      <LargeCards sales={sales} />

      {/* Order Fulfillment Breakdown */}
      <SmallCards orders={orders} />

      {/* Visual Analytics */}
      <DashboardCharts sales={sales} />
    </div>
  );
}
