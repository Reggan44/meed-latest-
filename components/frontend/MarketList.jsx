import React from "react";
import MarketsCarousel from "./MarketsCarousel";
import { getData } from "@/lib/getData";

export default async function MarketList() {
  const markets = await getData("markets");
  if (!Array.isArray(markets) || markets.length === 0) return null;
  return (
    <div className="text-slate-900 dark:text-white py-8 md:py-16">
      {/* Market Slider */}
      <div className="bg-slate-50 dark:bg-lime-900 rounded-lg p-4">
        <h2 className="py-2 text-center text-2xl text-slate-900 dark:text-slate-50 mb-4">
          Shop By Market
        </h2>
        <MarketsCarousel markets={markets} />
      </div>
    </div>
  );
}
