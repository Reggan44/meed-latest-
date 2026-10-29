import Heading from "@/components/backoffice/Heading";
import TableActions from "@/components/backoffice/TableActions";

import Link from "next/link";
import React from "react";
import { columns } from "./columns";
import { getData } from "@/lib/getData";
import DataTable from "@/components/data-table-components/DataTable";

export default async function page() {
  const vendors = await getData("vendors");
  return (
    <div>
      {/* Header */}
      <h2 className="mb-4 text-xl font-semibold">Sellers</h2>
      <div className="py-0">
        <DataTable data={vendors} columns={columns} filterKeys={["name"]} />
      </div>
    </div>
  );
}
