"use client";
import { addToCart } from "@/redux/slices/cartSlice";
import { BaggageClaim, ImageOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const money = (n) =>
  `Ksh ${Number(n || 0).toLocaleString("en-KE", { maximumFractionDigits: 0 })}`;

export default function Product({ product, inGrid = false }) {
  const dispatch = useDispatch();
  const image = product.imageUrl || product.productImages?.[0];
  const hasDiscount =
    product.productPrice > product.salePrice && product.salePrice > 0;
  const discount = hasDiscount
    ? Math.round((1 - product.salePrice / product.productPrice) * 100)
    : 0;
  const isNew =
    product.createdAt &&
    Date.now() - new Date(product.createdAt).getTime() < 30 * 24 * 3600 * 1000;
  const soldOut = (product.productStock ?? 1) <= 0;

  function handleAddToCart() {
    dispatch(addToCart(product));
    toast.success("Item added Successfully");
  }
  return (
    <div className={`group ${inGrid ? "" : "mr-3"} flex flex-col rounded-lg bg-white dark:bg-slate-900 overflow-hidden border border-slate-200 dark:border-slate-700`}>
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/5] bg-slate-100 dark:bg-slate-800"
      >
        {image ? (
          <Image
            src={image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            <ImageOff className="w-8 h-8" />
          </div>
        )}
        {isNew && (
          <span className="absolute top-2 left-2 rounded bg-slate-900 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white">
            NEW
          </span>
        )}
        {hasDiscount && (
          <span className="absolute top-2 right-2 rounded bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
            -{discount}%
          </span>
        )}
        {soldOut && (
          <span className="absolute inset-x-0 bottom-0 bg-slate-900/80 py-1 text-center text-xs text-white">
            Sold out
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link href={`/products/${product.slug}`}>
          <h2 className="line-clamp-2 text-sm font-medium text-slate-800 dark:text-slate-100">
            {product.title}
          </h2>
        </Link>
        <div className="flex items-baseline gap-2">
          <p className="font-semibold text-slate-900 dark:text-white">
            {money(product.salePrice)}
          </p>
          {hasDiscount && (
            <p className="text-xs text-slate-500 line-through">
              {money(product.productPrice)}
            </p>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={soldOut}
          className="mt-auto flex w-full items-center justify-center gap-2 rounded-md bg-lime-600 px-4 py-2 text-sm text-white hover:bg-lime-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          <BaggageClaim className="w-4 h-4" />
          <span>{soldOut ? "Sold out" : "Add to cart"}</span>
        </button>
      </div>
    </div>
  );
}
