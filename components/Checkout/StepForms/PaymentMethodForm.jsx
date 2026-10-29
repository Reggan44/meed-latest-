"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Smartphone } from "lucide-react";
import NavButtons from "../NavButtons";
import {
  setCurrentStep,
  updateCheckoutFormData,
} from "@/redux/slices/checkoutSlice";

export default function PaymentMethodForm() {
  const dispatch = useDispatch();
  const currentStep = useSelector((store) => store.checkout.currentStep);

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(updateCheckoutFormData({ paymentMethod: "IntaSend" }));
    dispatch(setCurrentStep(currentStep + 1));
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4 dark:text-lime-400">
        Payment Method
      </h2>
      <div className="flex items-center gap-4 p-5 rounded-lg border border-blue-600 text-blue-600 bg-white dark:bg-gray-800">
        <Smartphone className="w-8 h-8 flex-shrink-0" />
        <div>
          <p className="font-medium">Pay online with M-Pesa or Card</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You will be taken to a secure payment page after you place your
            order. Prices are in Kenyan Shillings (KSh).
          </p>
        </div>
      </div>
      <NavButtons />
    </form>
  );
}
