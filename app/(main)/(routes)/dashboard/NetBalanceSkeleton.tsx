// NetBalanceSkeleton.tsx
import React from "react";

export default function NetBalanceSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-2">
      <h3 className="text-sm font-semibold mb-2 px-4 bg-gray-300 animate-pulse rounded w-1/3"></h3>
      <div className="flex flex-col">
        <div className="flex gap-4 items-center px-4">
          <div className="h-8 w-32 bg-gray-300 animate-pulse rounded"></div>
          <span className="h-6 w-24 bg-gray-300 animate-pulse rounded"></span>
        </div>
        <div className="p-4 rounded-lg shadow-md flex flex-col gap-1">
          <div className="h-4 w-32 bg-gray-300 animate-pulse rounded"></div>
          <div className="h-4 w-32 bg-gray-300 animate-pulse rounded mt-2"></div>
        </div>
      </div>
    </div>
  );
}
