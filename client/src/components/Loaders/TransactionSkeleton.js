import React from "react";

const TransactionSkeleton = () => {
  return (
    <div className="h-auto flex flex-col grow gap-1">
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className="mx-auto w-full max-w-sm rounded-md p-4 bg-neutral-500 animate-fadeInOut"
        >
          <div className="flex space-x-4">
            <div className="size-10 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="space-y-3 flex flex-row items-center justify-center h-full">
                <div className="h-2 rounded bg-gray-200 flex grow animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionSkeleton;
