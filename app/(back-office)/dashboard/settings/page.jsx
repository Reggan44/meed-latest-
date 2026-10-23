import Heading from "@/components/backoffice/Heading";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";

export default async function Settings() {
  const session = await getServerSession(authOptions);
  const user = session?.user ?? {};
  const rows = [
    ["Name", user.name],
    ["Email", user.email],
    ["Role", user.role],
  ];
  return (
    <div>
      <Heading title="Settings" />
      <div className="max-w-xl rounded-lg bg-white dark:bg-slate-800 p-6 shadow space-y-6">
        <dl className="divide-y divide-slate-200 dark:divide-slate-700">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between py-3">
              <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
              <dd className="font-medium">{value || "-"}</dd>
            </div>
          ))}
        </dl>
        <Link
          href="/forgot-password"
          className="inline-block rounded-lg bg-lime-600 hover:bg-lime-700 text-white px-5 py-2.5"
        >
          Change password
        </Link>
      </div>
    </div>
  );
}
