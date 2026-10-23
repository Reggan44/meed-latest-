import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { getData } from "@/lib/getData";
import React from "react";
import { columns } from "./columns";

const STAFF_ROLES = ["ADMIN", "MODERATOR"];

export default async function Staff() {
  const users = await getData("users");
  const staff = (Array.isArray(users) ? users : []).filter((user) =>
    STAFF_ROLES.includes(user.role)
  );
  return (
    <div>
      <PageHeader
        heading="Staff"
        href="/dashboard/staff/new"
        linkTitle="Add Staff"
      />
      <div className="py-0">
        <DataTable data={staff} columns={columns} filterKeys={["name"]} />
      </div>
    </div>
  );
}
