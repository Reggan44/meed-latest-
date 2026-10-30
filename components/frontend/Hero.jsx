import Link from "next/link";
import React from "react";
import HeroCarousel from "./HeroCarousel";
import { CircleDollarSign, HelpCircle } from "lucide-react";
import SidebarCategories from "./SidebarCategories";
import { getBanners } from "@/lib/storefront";

export default async function Hero() {
  const banners = await getBanners();
  return (
    <div className="mb-6 grid grid-cols-12 gap-4 lg:gap-8">
      <SidebarCategories />
      <div className="col-span-full overflow-hidden rounded-md bg-blue-600 lg:col-span-7">
        <HeroCarousel banners={banners} />
      </div>
      <div className="col-span-2 hidden rounded-lg bg-white p-3 dark:bg-slate-800 lg:col-span-2 lg:block">
        <Link href="/support" className="flex items-center space-x-1 mb-3">
          <HelpCircle className="shrink-0 w-5 h-5 dark:text-lime-500 text-slate-900" />
          <div className="flex flex-col">
            <h2 className="uppercase text-sm">Help Center</h2>
            <p className="text-[0.6rem]">FAQs and support</p>
          </div>
        </Link>
        <Link
          href="/sell"
          className="flex items-center space-x-1 mb-6"
        >
          <CircleDollarSign className="shrink-0 w-5 h-5 dark:text-lime-500 text-slate-900" />
          <div className="flex flex-col">
            <h2 className="uppercase text-sm">Sell on Meed</h2>
            <p className="text-[0.6rem]">Reach Meed shoppers</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
