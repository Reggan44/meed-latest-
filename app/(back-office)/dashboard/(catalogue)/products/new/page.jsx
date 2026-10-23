import FormHeader from "@/components/backoffice/FormHeader";
import NewProductForm from "@/components/backoffice/NewProductForm";
import { getData } from "@/lib/getData";
import React from "react";

export default async function NewProduct() {
  //Categories and Farmers
  const categoriesData = await getData("categories");
  const usersDataRaw = await getData("users");
  const usersData = Array.isArray(usersDataRaw) ? usersDataRaw : [];
  const categories = Array.isArray(categoriesData) ? categoriesData : [];
  // Example loading state
  if (!categoriesData) {
    return <div>Loading...</div>;
  }
  const farmersData = usersData.filter((user) => user.role && user.role !== "USER");
  const farmers = farmersData.map((farmer) => {
    return {
      id: farmer.id,
      title: farmer.name,
    };
  });
  // console.log(farmers);
  const categoryOptions = categories.map((category) => {
    return {
      id: category.id,
      title: category.title,
    };
  });
  return (
    <div>
      <FormHeader title="New Product" />
      <NewProductForm categories={categoryOptions} farmers={farmers} />
    </div>
  );
}
