"use client";
import {
  AlignJustify,
  Bell,
  LayoutDashboard,
  LogOut,
  Settings,
  Sun,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeSwitcherBtn from "../ThemeSwitcherBtn";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import { useSession } from "next-auth/react";
export default function Navbar({ setShowSidebar, showSidebar }) {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    const base = "";
    async function load() {
      try {
        const [pRes, oRes] = await Promise.all([
          fetch(`${base}/api/products`),
          fetch(`${base}/api/orders`),
        ]);
        const products = pRes.ok ? await pRes.json() : [];
        const orders = oRes.ok ? await oRes.json() : [];
        const stock = (Array.isArray(products) ? products : [])
          .filter((p) => p.isActive && (p.productStock ?? 0) <= 5)
          .map((p) => ({
            id: `stock-${p.id}`,
            message: `${p.title} ${p.productStock > 0 ? `is low (${p.productStock} left)` : "is out of stock"}`,
            label: p.productStock > 0 ? "Low Stock" : "Stock Out",
            color: p.productStock > 0 ? "bg-orange-600" : "bg-red-700",
            date: p.updatedAt,
            href: `/dashboard/products/update/${p.id}`,
          }));
        const pending = (Array.isArray(orders) ? orders : [])
          .filter((o) => o.orderStatus === "PENDING")
          .map((o) => ({
            id: `order-${o.id}`,
            message: `New order #${o.orderNumber ?? o.id.slice(-6)} is pending`,
            label: "Pending Order",
            color: "bg-blue-600",
            date: o.createdAt,
            href: "/dashboard/orders",
          }));
        setNotifications(
          [...stock, ...pending].sort((a, b) => new Date(b.date) - new Date(a.date))
        );
      } catch (e) {
        console.log(e);
      }
    }
    load();
  }, []);
  if (status === "loading") {
    return <p>Loading...</p>;
  }
  return (
    <div className="flex items-center justify-between bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 h-20 py-8 fixed top-0 w-full px-8 z-50 sm:pr-[20rem] ">
      <Link href={"/dashboard"} className="sm:hidden">
        Meed Collections
      </Link>
      {/* Icon */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="text-lime-700 dark:text-lime-500"
      >
        <AlignJustify />
      </button>
      {/* 3 Icons */}
      <div className="flex space-x-3 ">
        <ThemeSwitcherBtn />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button
              type="button"
              className="relative inline-flex items-center p-3 text-sm font-medium text-center text-slate-700 dark:text-white bg-transparent rounded-lg "
            >
              <Bell className="text-lime-700 dark:text-lime-500" />
              <span className="sr-only">Notifications</span>
              <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500  rounded-full -top-0 end-6 dark:border-gray-900">
                {notifications.length > 99 ? "99+" : notifications.length}
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="py-2 px-4 pr-8 max-h-96 overflow-y-auto">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 && (
              <p className="px-2 py-4 text-sm text-slate-500">
                You&apos;re all caught up.
              </p>
            )}
            {notifications.map((n) => (
              <React.Fragment key={n.id}>
                <DropdownMenuItem asChild>
                  <Link href={n.href} className="flex flex-col items-start space-y-1">
                    <p>{n.message}</p>
                    <div className="flex items-center space-x-2">
                      <p className={`px-3 py-0.5 text-white rounded-full text-sm ${n.color}`}>
                        {n.label}
                      </p>
                      <p className="text-sm">{new Date(n.date).toLocaleString()}</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {status === "authenticated" && <UserAvatar user={session?.user} />}
      </div>
    </div>
  );
}
