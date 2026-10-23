import FilterComponent from "@/components/frontend/Filter/FilterComponent";
import { getData } from "@/lib/getData";
import React from "react";

export default async function Search({ searchParams }) {
  //SORTING, SEARCHING AND FILTERING
  const {
    sort = "asc",
    min = 0,
    max = "",
    page = 1,
    search = "",
    category: categorySlug = "",
  } = searchParams;
  const result = await getData(
    `products/search?search=${encodeURIComponent(search)}&page=${page}&sort=${sort}&min=${min}&max=${max}&category=${categorySlug}`
  );
  const products = Array.isArray(result?.products) ? result.products : [];
  const total = result?.total ?? products.length;
  const category = {
    title: search || categorySlug || "All products",
    slug: "",
    isSearch: true,
    products,
    total,
  };
  return (
    <div>
      <FilterComponent category={category} products={category.products} />
    </div>
  );
}
