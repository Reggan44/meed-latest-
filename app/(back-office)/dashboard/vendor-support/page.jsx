import Heading from "@/components/backoffice/Heading";
import Link from "next/link";
import React from "react";

export default function VendorSupport() {
  return (
    <div>
      <Heading title="Vendor Support" />
      <div className="max-w-xl rounded-lg bg-white dark:bg-slate-800 p-6 shadow space-y-4">
        <p>
          Need help with your shop, products or payouts? Visit our support page
          for answers and to reach the team.
        </p>
        <Link
          href="/support"
          className="inline-block rounded-lg bg-lime-600 hover:bg-lime-700 text-white px-5 py-2.5"
        >
          Open support
        </Link>
      </div>
    </div>
  );
}
