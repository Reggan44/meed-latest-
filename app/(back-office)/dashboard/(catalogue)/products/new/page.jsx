import FormHeader from "@/components/backoffice/FormHeader";
import NewProductForm from "@/components/backoffice/NewProductForm";
import { getData } from "@/lib/getData";
import React from "react";

export default async function NewProduct() {
  //Categories and Sellers
  const categoriesData = await getData("categories");
  const usersDataRaw = await getData("users");
  const usersData = Array.isArray(usersDataRaw) ? usersDataRaw : [];
  const categories = Array.isArray(categoriesData) ? categoriesData : [];
  // Example loading state
  if (!categoriesData) {
    return <div>Loading...</div>;
  }
  const sellersData = usersData.filter((user) => user.role && user.role !== "USER");
  const sellers = sellersData.map((seller) => {
    return {
      id: seller.id,
      title: seller.name,
    };
  });
  // console.log(sellers);
  const categoryOptions = categories.map((category) => {
    return {
      id: category.id,
      title: category.title,
    };
  });
  return (
    <div>
      <FormHeader title="New Product" />
      <NewProductForm categories={categoryOptions} sellers={sellers} />
    </div>
  );
}
