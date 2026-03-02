"use client";
import ImageInput from "@/components/FormInputs/ImageInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import TextareaInput from "@/components/FormInputs/TextAreaInput";
import TextInput from "@/components/FormInputs/TextInput";
import ToggleInput from "@/components/FormInputs/ToggleInput";
import FormHeader from "@/components/backoffice/FormHeader";
import NewVendorForm from "@/components/backoffice/NewVendorForm";
import { makePostRequest } from "@/lib/apiRequest";
import { generateCouponCode } from "@/lib/generateCouponCode";
import { generateSlug } from "@/lib/generateSlug";
import { generateUserCode } from "@/lib/generateUserCode";
import { useRouter } from "next/navigation";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function NewVendor() {
  return (
    <div>
      <FormHeader title="New Vendor" />
      <NewVendorForm />
    </div>
  );
}
