import NewStoreForm from "@/components/backoffice/NewStoreForm";
import { getData } from "@/lib/getData";
import React from "react";

export default async function NewStore() {
  const categoriesData = await getData("categories");
  const categories = categoriesData.map((category) => {
    return {
      id: category.id,
      title: category.title,
    };
  });
  return <NewStoreForm categories={categories} />;
}