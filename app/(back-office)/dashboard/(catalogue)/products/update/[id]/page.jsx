import FormHeader from "@/components/backoffice/FormHeader";
import NewProductForm from "@/components/backoffice/NewProductForm";
import { getData } from "@/lib/getData";
import React from "react";

export default async function UpdateProduct({ params: { id } }) {
  const product = await getData(`products/${id}`);
  //Categories and Farmers
  const categoriesData = await getData("categories");
  const usersDataRaw = await getData("users");
  const usersData = Array.isArray(usersDataRaw) ? usersDataRaw : [];
  const categories = Array.isArray(categoriesData) ? categoriesData : [];
  const farmersData = usersData.filter((user) => user.role && user.role !== "USER");
  const farmers = farmersData.map((farmer) => {
    return {
      id: farmer.id,
      title: farmer.name,
    };
  });
  const categoryOptions = categories.map((category) => {
    return {
      id: category.id,
      title: category.title,
    };
  });
  return (
    <div>
      <FormHeader title="Update Product" />
      <NewProductForm
        updateData={product}
        categories={categoryOptions}
        farmers={farmers}
      />
    </div>
  );
}
