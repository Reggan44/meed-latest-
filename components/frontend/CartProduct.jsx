"use client";
import {
  decrementQty,
  incrementQty,
  removeFromCart,
} from "@/redux/slices/cartSlice";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export default function CartProduct({ cartItem }) {
  const dispatch = useDispatch();
  function handleCartItemDelete(cartId) {
    // Dispatch the removeFromCart Reducer
    dispatch(removeFromCart(cartId));
    toast.success("Item removed Successfully");
  }
  function handleQtyIncrement(cartId) {
    dispatch(incrementQty(cartId));
  }
  function handleQtyDecrement(cartId) {
    dispatch(decrementQty(cartId));
  }
  return (
    <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 border-b border-slate-400 pb-3 text-sm font-semibold sm:flex sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <Image
          src={cartItem.imageUrl}
          width={249}
          height={249}
          alt={cartItem.title}
          className="h-16 w-16 shrink-0 rounded-xl object-cover sm:h-20 sm:w-20"
        />
        <div className="flex flex-col">
          <h2 className="line-clamp-2 break-words text-xs sm:text-sm">{cartItem.title}</h2>
        </div>
      </div>
      <div className="col-start-1 row-start-2 flex items-center rounded-xl border border-gray-400 sm:col-auto sm:row-auto">
        <button
          onClick={() => handleQtyDecrement(cartItem.id)}
          aria-label={`Decrease quantity of ${cartItem.title}`}
          className="flex h-10 w-10 items-center justify-center border-r border-gray-400"
        >
          <Minus className="h-4 w-4" />
        </button>
        <p className="min-w-10 px-2 text-center">{cartItem.qty}</p>
        <button
          onClick={() => handleQtyIncrement(cartItem.id)}
          aria-label={`Increase quantity of ${cartItem.title}`}
          className="flex h-10 w-10 items-center justify-center border-l border-gray-400"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="col-start-2 row-span-2 flex items-center justify-self-end gap-2 text-right sm:col-auto sm:row-auto">
        <div className="flex flex-col justify-center">
          <h4 className="text-xs sm:text-sm">KSh {(cartItem.salePrice * cartItem.qty).toFixed(2)}</h4>
          <p className="text-[10px] text-gray-300">
            (KSh {cartItem.salePrice}x {cartItem.qty})
          </p>
        </div>
        <button
          onClick={() => handleCartItemDelete(cartItem.id)}
          aria-label={`Remove ${cartItem.title} from cart`}
          className="flex h-10 w-10 shrink-0 items-center justify-center"
        >
          <Trash2 className="text-red-600 w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
