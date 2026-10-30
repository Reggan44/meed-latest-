"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

export default function Sorting({ title, slug, isSearch }) {
  const searchParams = useSearchParams();
  const sortParam = searchParams.get("sort");
  const min = searchParams.get("min") || 0;
  const max = searchParams.get("max") || "";
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page")) || 1;
  console.log(sortParam);
  const sortingLinks = [
    {
      title: "Relevance",
      href: isSearch ? `/search?search=${search}` : `/category/${slug}`,
      sort: null,
    },
    {
      title: "Price - High to Low",
      href: isSearch
        ? `/search?search=${search}&page=${page}&sort=desc&min=${min}&max=${max}`
        : `/category/${slug}?page=${page}&sort=desc&min=${min}&max=${max}`,
      sort: "desc",
    },
    {
      title: "Price - Low to High",
      href: isSearch
        ? `/search?search=${search}&page=${page}&sort=asc&min=${min}&max=${max}`
        : `/category/${slug}?page=${page}&sort=asc&min=${min}&max=${max}`,
      sort: "asc",
    },
  ];
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="break-words text-xl font-medium sm:text-2xl">
        {isSearch && "Search Results - "}
        {title}
      </h2>
      <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:gap-3">
        <p className="shrink-0">Sort by:</p>
        <div className="flex flex-wrap items-center">
          {sortingLinks.map((link, i) => {
            return (
              <Link
                key={i}
                className={`whitespace-nowrap text-xs sm:text-sm ${
                  link.sort === sortParam
                    ? "bg-slate-800 px-2 py-1 border border-lime-400 text-lime-400"
                    : "border border-slate-500 px-2 py-1"
                }`}
                href={link.href}
              >
                <span className="sm:hidden">
                  {link.sort === "desc"
                    ? "High to low"
                    : link.sort === "asc"
                      ? "Low to high"
                      : "Relevance"}
                </span>
                <span className="hidden sm:inline">{link.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
