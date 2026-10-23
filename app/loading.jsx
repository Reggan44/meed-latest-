import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="p-8" aria-busy="true">
      <Skeleton className="h-64" />
    </div>
  );
}
