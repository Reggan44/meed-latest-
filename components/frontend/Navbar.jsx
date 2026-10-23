"use client";
import React from "react";
import SearchForm from "./SearchForm";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/limiLogo.webp";
import { HelpCircle, ShoppingCart, User } from "lucide-react";
import ThemeSwitcherBtn from "../ThemeSwitcherBtn";
import HelpModal from "./HelpModal";
import CartCount from "./CartCount";
import { useSession } from "next-auth/react";
import UserAvatar from "../backoffice/UserAvatar";
export default function Navbar() {
  const { data: session, status } = useSession();
  return (
    <div className="bg-white dark:bg-slate-700">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-8 md:flex-nowrap md:gap-8">
        <Link href="/" className="shrink-0">
          <Image src={logo} alt="Meed Collections logo" className="w-20 md:w-24" />
        </Link>
        <div className="order-last w-full md:order-none md:w-auto md:flex-grow">
          <SearchForm />
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          {status === "loading" ? (
            <div className="h-10 w-10" />
          ) : status === "unauthenticated" ? (
            <Link
              href="/login"
              className="flex items-center space-x-1 text-green-950 dark:text-slate-100"
            >
              <User />
              <span className="hidden sm:inline">Login</span>
            </Link>
          ) : (
            <UserAvatar user={session?.user} />
          )}
          <HelpModal />
          <CartCount />
          <ThemeSwitcherBtn />
        </div>
      </div>
    </div>
  );
}
