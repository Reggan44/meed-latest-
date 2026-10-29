import FormHeader from "@/components/backoffice/FormHeader";
import NewProductForm from "@/components/backoffice/NewProductForm";
import { getData } from "@/lib/getData";
import React from "react";

export default async function UpdateProduct({ params: { id } }) {
  const product = await getData(`products/${id}`);
  //Categories and Sellers
  const categoriesData = await getData("categories");
  const usersDataRaw = await getData("users");
  const usersData = Array.isArray(usersDataRaw) ? usersDataRaw : [];
  const categories = Array.isArray(categoriesData) ? categoriesData : [];
  const sellersData = usersData.filter((user) => user.role && user.role !== "USER");
  const sellers = sellersData.map((seller) => {
    return {
      id: seller.id,
      title: seller.name,
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
        sellers={sellers}
      />
    </div>
  );
}
