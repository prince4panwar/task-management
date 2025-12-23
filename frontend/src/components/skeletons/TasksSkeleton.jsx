import React from "react";
import { Skeleton } from "../ui/skeleton";

function TasksSkeleton({ classnames }) {
  return (
    <div className={`p-5 w-full dark-bg flex flex-col gap-2 ${classnames}`}>
      <Skeleton className="w-full h-10 rounded-lg" />
      <Skeleton className="w-full h-20 rounded-lg" />
      <Skeleton className="w-full h-20 rounded-lg" />
      <Skeleton className="w-full h-20 rounded-lg" />
      <Skeleton className="w-full h-20 rounded-lg" />
      <Skeleton className="w-full h-20 rounded-lg" />
      <Skeleton className="w-full h-20 rounded-lg" />
      <Skeleton className="w-full h-20 rounded-lg" />
      <Skeleton className="w-full h-10 rounded-lg" />
    </div>
  );
}

export default TasksSkeleton;
