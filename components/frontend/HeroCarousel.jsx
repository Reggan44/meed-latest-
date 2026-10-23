"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Carousel from "nuka-carousel";

export default function HeroCarousel({ banners }) {
  const config = {
    nextButtonClassName: "rounded-full",
    nextButtonText: <ChevronRight />,
    pagingDotsClassName: "me-2 w-4 h-4",
    prevButtonClassName: "rounded-full",
    prevButtonText: <ChevronLeft />,
  };
  if (!Array.isArray(banners) || banners.length === 0) {
    return (
      <div className="rounded-md bg-gradient-to-br from-lime-700 to-slate-900 text-white flex flex-col items-center justify-center text-center p-8 h-full min-h-[240px]">
        <h2 className="text-2xl sm:text-3xl font-semibold">Welcome to Meed Collections</h2>
        <p className="mt-2 text-slate-200">Discover our latest products</p>
      </div>
    );
  }
  return (
    <Carousel
      defaultControlsConfig={config}
      autoplay
      className="rounded-md overflow-hidden"
      wrapAround
    >
      {banners.map((banner, i) => {
        return (
          <Link key={i} href={banner.link} className="">
            <Image
              width={712}
              height={384}
              src={banner.imageUrl}
              className="w-full"
              alt={banner.title}
            />
          </Link>
        );
      })}
    </Carousel>
  );
}
