import React from "react";

const TransactionSkeleton = () => {
  return (
    <div class="mx-auto w-full max-w-sm rounded-md border border-teal-300 p-4 mb-2">
      <div class="flex animate-pulse space-x-4">
        <div class="size-10 rounded-full bg-gray-200"></div>
        <div class="flex-1 space-y-6 py-1">
          <div class="space-y-3 flex flex-row items-center justify-center h-full">
            <div class="h-2 rounded bg-gray-200 flex grow"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionSkeleton;
