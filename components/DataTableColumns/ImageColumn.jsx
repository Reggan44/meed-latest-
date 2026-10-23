import Image from "next/image";
import { ImageOff } from "lucide-react";
import React from "react";

export default function ImageColumn({ row, accessorKey }) {
  const imageUrl =
    row.getValue(`${accessorKey}`) || row.original?.productImages?.[0] || "";
  return (
    <div className="shrink-0">
      {imageUrl ? (
        <Image
          src={imageUrl}
          width={500}
          height={500}
          alt={`${accessorKey}`}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div
          className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500"
          title="No image"
        >
          <ImageOff className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
