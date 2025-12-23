import React from "react";
import { Skeleton } from "../ui/skeleton";

function RecentTasksSkeleton({ classnames }) {
  return (
    <div className={`p-5 w-full dark-bg grid grid-cols-3 gap-4 ${classnames}`}>
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
