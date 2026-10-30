"use client";
import { addToCart } from "@/redux/slices/cartSlice";
import { BaggageClaim } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export default function AddToCartButton({ product }) {
  const dispatch = useDispatch();
  function handleAddToCart() {
    // Dispatch the reducer
    dispatch(addToCart(product));
    toast.success("Item added Successfully");
  }
  return (
    <button
      onClick={() => handleAddToCart()}
      className="flex min-h-11 w-full items-center justify-center space-x-2 rounded-md bg-lime-600 px-4 py-2 text-white sm:w-auto"
    >
      <BaggageClaim />
      <span>Add to Cart</span>
    </button>
  );
}
