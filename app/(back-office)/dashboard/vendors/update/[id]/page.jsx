import FormHeader from "@/components/backoffice/FormHeader";
import NewFarmerForm from "@/components/backoffice/NewVendorForm";
import React from "react";

export default function UpdateVendor({ params: { id } }) {
  return (
    <div>
      <FormHeader title="New Vendorr" />
      <NewVendorForm />
    </div>
  );
}
