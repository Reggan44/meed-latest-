import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import Breadcrumb from "./Breadcrumb";
import Sorting from "./Sorting";
import Filters from "./Filters";
import FilteredProducts from "./FilteredProducts";

export default function FilterComponent({ category, products }) {
  const { title, slug } = category;
  const productCount = category.total ?? category.products.length;
  return (
    <div>
      <div className="space-y-6 bg-white px-4 py-8 text-slate-900">
        <Breadcrumb title={title} resultCount={productCount} />
        <Sorting isSearch={category?.isSearch} title={title} slug={slug} />
      </div>
      <div className="grid grid-cols-1 gap-4 py-8 md:grid-cols-12">
        <div className="min-w-0 md:col-span-3">
          <Filters slug={slug} isSearch={category?.isSearch} />
        </div>
        <div className="min-w-0 md:col-span-9">
          <FilteredProducts
            isSearch={category?.isSearch}
            productCount={productCount}
            products={products}
          />
        </div>
      </div>
    </div>
  );
}
