import Heading from "@/components/backoffice/Heading";
import PageHeader from "@/components/backoffice/PageHeader";
import TableActions from "@/components/backoffice/TableActions";

import Link from "next/link";
import React from "react";
import { columns } from "./columns";
import { getData } from "@/lib/getData";
import DataTable from "@/components/data-table-components/DataTable";

export default async function page() {
  const stores = await getData("stores");
  return (
    <div>
      {/* Header */}
      <PageHeader
        heading="Stores"
        href="/dashboard/stores/new"
        linkTitle="Add Store"
      />
      <div className="py-0">
        <DataTable data={stores} columns={columns} />
      </div>
    </div>
  );
}