import { getCategoriesWithProducts } from "@/lib/storefront";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function SidebarCategories() {
  const categoriesData = await getCategoriesWithProducts();
  // Only categories with Products
  const categories = (Array.isArray(categoriesData) ? categoriesData : []).filter(
    (category) => (category.products?.length ?? 0) > 0
  );
  // console.log(categories);
  return (
    <>
      <nav
        aria-label="Shop by category"
        className="col-span-full lg:hidden"
      >
        <p className="mb-2 text-sm font-semibold">Shop by category</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="shrink-0 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
            >
              {category.title}
            </Link>
          ))}
        </div>
      </nav>
      <div className="hidden overflow-hidden rounded-lg border border-gray-300 bg-white text-slate-800 dark:border-gray-700 dark:bg-gray-700 lg:col-span-3 lg:block">
        <h2 className="border-b border-gray-300 bg-slate-100 px-6 py-3 font-semibold text-slate-800 dark:border-gray-600 dark:bg-gray-800 dark:text-slate-100">
          Shop By Category ({categories.length})
        </h2>
        <div className="flex h-[300px] flex-col gap-2 overflow-y-auto px-6 py-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="flex items-center gap-3 rounded-md transition-all duration-300 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-600"
            >
              {category.imageUrl ? (
                <Image
                  width={556}
                  height={556}
                  className="h-10 w-10 rounded-full border border-lime-300 object-cover"
                  src={category.imageUrl}
                  alt={category.title}
                />
              ) : (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-600 font-semibold uppercase text-white">
                  {category.title?.[0]}
                </span>
              )}
              <span className="text-sm">{category.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
