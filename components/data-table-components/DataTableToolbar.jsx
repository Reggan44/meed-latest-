"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import { DataTableViewOptions } from "./DataTableViewOptions";

function escapeCell(value) {
  let text =
    value === null || value === undefined
      ? ""
      : typeof value === "object"
      ? JSON.stringify(value)
      : String(value);
  // Prevent spreadsheet formula injection
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

function exportCsv(table) {
  const selected = table.getSelectedRowModel().rows;
  const rows = selected.length > 0 ? selected : table.getPrePaginationRowModel().rows;
  const columns = table
    .getAllLeafColumns()
    .filter((col) => col.accessorFn && col.getIsVisible());
  if (rows.length === 0) return;
  const header = columns.map((col) =>
    escapeCell(typeof col.columnDef.header === "string" ? col.columnDef.header : col.id)
  );
  const lines = rows.map((row) =>
    columns.map((col) => escapeCell(row.getValue(col.id))).join(",")
  );
  const csv = [header.join(","), ...lines].join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `export-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function DataTableToolbar({ table, filterKeys }) {
  //IF any of the keys have a value
  const isFiltered = filterKeys.some(
    (key) => table.getState().columnFilters[key]?.length > 0
  );

  const handleInputChange = (key, value) => {
    table.getColumn(key)?.setFilterValue(value);
  };

  const handleResetClick = () => {
    filterKeys.forEach((key) => {
      table.getColumn(key)?.setFilterValue("");
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex min-w-0 flex-1 items-center space-x-2">
        {filterKeys.map((key) => (
          <Input
            key={key}
            placeholder={`Filter ${key}...`}
            value={table.getColumn(key)?.getFilterValue() ?? ""}
            onChange={(event) => handleInputChange(key, event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        ))}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={handleResetClick}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => exportCsv(table)}
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
