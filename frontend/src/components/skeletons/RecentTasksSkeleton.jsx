import React from "react";
import { Skeleton } from "../ui/skeleton";

function RecentTasksSkeleton({ classnames }) {
  return (
    <div
      className={`p-5 w-screen h-screen dark-bg grid gap-3 sm:grid-cols-2 lg:grid-cols-3 ${classnames}`}
    >
      <Skeleton className="w-full rounded-lg" />
      <Skeleton className="w-full rounded-lg" />
      <Skeleton className="w-full rounded-lg" />
      <Skeleton className="w-full rounded-lg" />
      <Skeleton className="w-full rounded-lg" />
      <Skeleton className="w-full rounded-lg" />
      <Skeleton className="w-full rounded-lg" />
      <Skeleton className="w-full rounded-lg" />
      <Skeleton className="w-full rounded-lg" />
    </div>
  );
}

export default RecentTasksSkeleton;
