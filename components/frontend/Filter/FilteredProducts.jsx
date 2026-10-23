import React from "react";
import Product from "../Product";
import Paginate from "./Paginate";

export default async function FilteredProducts({
  products,
  productCount,
  isSearch,
}) {
  // PAGINATION
  const pageSize = 24;
  const totalPages = Math.ceil(productCount / pageSize);
  return (
    <div className="">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {products.map((product, i) => {
          return <Product product={product} key={i} inGrid />;
        })}
      </div>
      <div className="p-8 mx-auto flex items-center justify-center  w-full">
        <Paginate totalPages={totalPages} isSearch={isSearch} />
      </div>
    </div>
  );
}
