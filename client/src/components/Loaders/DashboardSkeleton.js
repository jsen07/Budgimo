import React from "react";
import TransactionSkeleton from "./TransactionSkeleton";

const DashboardSkeleton = () => {
  return (
    <>
      <div className="w-full px-4 flex flex-col h-screen pb-[200px] border 2xl:p-4">
        {/* Budget & Balance Display */}
        <div className="flex flex-col w-full p-2 gap-4 mb-4 rounded-lg bg-neutral-500 animate-pulse">
          <div className="flex flex-row justify-between items-center py-3">
            <h1 className="w-24 size-8 rounded-md bg-gray-200 animate-pulse"></h1>
            <div className="w-24 size-8 rounded-md bg-gray-200 animate-pulse"></div>
          </div>
          <div className="w-24 flex flex-row justify-between bg-gray-200 animate-pulse rounded-md size-5"></div>
          <h1 className="w-40 size-12 rounded-md bg-gray-200 animate-pulse"></h1>
          <div className="text-xs flex flex-row w-full justify-between font-semibold"></div>
          <div className="w-full rounded-full h-2.5 mb-4">
            <div className="h-2.5 rounded-full bg-gray-200 animate-pulse"></div>
          </div>
          {/* BUTTON  */}
          <div className="w-1/3 h-[42px] justify-center border rounded-xl p-2 bg-gray-200 animate-pulse">
            {" "}
          </div>
        </div>

        {/* Transactions Section */}
        <div className="flex flex-row justify-between w-full my-2 items-center rounded-lg bg-neutral-500 animate-pulse size-6 px-2">
          <h1 className=" size-3 w-24 bg-gray-200 animate-pulse rounded-md"></h1>

          <button className=" size-3 w-12 bg-gray-200 animate-pulse rounded-md"></button>
        </div>
        <div className="h-full flex flex-col">
          <TransactionSkeleton />
        </div>

        {/* <div className="flex flex-row justify-between w-full my-2 items-center rounded-lg bg-neutral-500 animate-pulse size-6 px-2">
          <h1 className=" size-3 w-24 bg-gray-200 animate-pulse rounded-md"></h1>

          <button className=" size-3 w-12 bg-gray-200 animate-pulse rounded-md"></button>
        </div> */}
      </div>
    </>
  );
};

export default DashboardSkeleton;
