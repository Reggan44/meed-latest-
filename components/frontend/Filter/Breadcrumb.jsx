"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function Breadcrumb({ title, resultCount }) {
  const searchParams = useSearchParams();
  const currentPage = searchParams.get("page") || 1;
  const pageSize = 24;
  const startRange = (currentPage - 1) * pageSize + 1;
  const endRange = Math.min(currentPage * pageSize, resultCount);

  return (
    <div className="flex flex-col gap-1 text-xs sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center">
        <Link href="/">Home</Link>
        <ChevronRight className="h-5 w-5 shrink-0" />
        <p className="truncate">{title}</p>
      </div>
      <p>
        {startRange}-{endRange} of {resultCount} results
      </p>
    </div>
  );
}
