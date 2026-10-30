import AddToCartButton from "@/components/frontend/AddToCartButton";
import Breadcrumb from "@/components/frontend/Breadcrumb";
import CategoryCarousel from "@/components/frontend/CategoryCarousel";
import ProductImageCarousel from "@/components/frontend/ProductImageCarousel";
import ProductShareButton from "@/components/frontend/ProductShareButton";
import { getData } from "@/lib/getData";
import { BaggageClaim, Minus, Plus, Send, Share2, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function ProductDetailPage({ params: { slug } }) {
  const product = await getData(`products/product/${slug}`);
  const { id } = product;
  const discount =
    product.productPrice > product.salePrice && product.productPrice > 0
      ? Math.round(
          ((product.productPrice - product.salePrice) / product.productPrice) * 100
        )
      : 0;
  const catId = product.categoryId;
  const category = await getData(`categories/${catId}`);
  const categoryProducts = category?.products ?? [];
  const products = categoryProducts.filter((product) => product.id !== id);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const urlToShare = `${baseUrl}/products/${slug}`;
  return (
    <div>
      <Breadcrumb />
      <div className="grid grid-cols-12 gap-x-0 gap-y-6 md:gap-8">
        <ProductImageCarousel
          productImages={product.productImages}
          thumbnail={product.imageUrl}
          altText={product.title}
        />
        <div className="col-span-12 md:col-span-6 lg:col-span-6 min-w-0">
          <div className="mb-6 flex items-start justify-between gap-3">
            <h2 className="min-w-0 break-words text-xl font-semibold lg:text-3xl">
              {product.title}
            </h2>
            <ProductShareButton urlToShare={urlToShare} />
          </div>
          <div className="border-b border-gray-500">
            <p className="py-2 ">{product.description}</p>
            <div className="mb-4 flex flex-wrap items-center gap-3 sm:gap-8">
              <p className="break-all">SKU: {product.sku}</p>
              <p className="rounded-full bg-lime-200 px-4 py-1.5 text-slate-900">
                <b>Stock</b>: {product.productStock}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-500 pb-4 pt-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <h4 className="text-xl sm:text-2xl">Ksh {product.salePrice}</h4>
              <del className="text-slate-400 text-sm">
                Ksh {product.productPrice}
              </del>
            </div>
            {discount > 0 && (
              <p className="flex items-center">
                <Tag className="w-5 h-5 text-slate-400 me-2" />
                <span>Save {discount}% right now</span>
              </p>
            )}
          </div>
          <div className="flex items-center justify-between py-6">
            <AddToCartButton product={product} />
          </div>
        </div>
        <aside className="col-span-12 lg:col-span-3 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden self-start">
          <h2 className="bg-slate-100 dark:bg-gray-800 py-3 px-6 font-semibold border-b border-gray-300 dark:border-gray-600 text-slate-800 dark:text-slate-100">
            DELIVERY & RETURNS
          </h2>
          <ul className="p-4 space-y-3 text-sm text-slate-700 dark:text-slate-200">
            <li className="flex gap-2">
              <Send className="w-4 h-4 mt-0.5 shrink-0" />
              Delivery available across Kenya. Fee and timing are confirmed by the shop after you order.
            </li>
            <li className="flex gap-2">
              <Tag className="w-4 h-4 mt-0.5 shrink-0" />
              Prices are in Kenyan Shillings (Ksh).
            </li>
            <li>
              Questions about this item?{" "}
              <Link href="/support" className="underline">
                Contact support
              </Link>
            </li>
          </ul>
        </aside>
      </div>
      <div className="bg-white dark:bg-slate-700 my-8 rounded-xl p-4">
        <h2 className="mb-4 text-xl font-semibold text-slate-200 ml-3">
          Similar Products
        </h2>
        <CategoryCarousel products={products} />
      </div>
    </div>
  );
}
