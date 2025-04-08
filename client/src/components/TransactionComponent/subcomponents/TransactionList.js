import React from "react";
import FastfoodRoundedIcon from "@mui/icons-material/FastfoodRounded";
import { getRandomColor } from "../../../utils/helperFunctions";
import clsx from "clsx";
import TransactionSkeleton from "../../Loaders/TransactionSkeleton";
import useDelayedLoading from "../../../hooks/DelayedLoading";

const TransactionList = ({ limit, transactionData, loading, error }) => {
  const showLoading = useDelayedLoading(loading, 1000);

  const transactionsToShow = limit
    ? transactionData?.slice(0, limit)
    : transactionData;

  return (
    <>
      {showLoading && (
        <>
          <TransactionSkeleton />
          <TransactionSkeleton />
          <TransactionSkeleton />
        </>
      )}
      {error && <p>Error loading transactions: {error.message}</p>}

      {transactionsToShow?.length > 0 ? (
        <div>
          {transactionsToShow?.map((expense) => {
            const randomColor = getRandomColor();
            // const date = formatDateShort(expense.date);

            return (
              <div
                key={expense.id}
                className={clsx(
                  "flex flex-row justify-between items-center border rounded-lg p-3 mb-2",
                  `border-${randomColor}`
                )}
              >
                <div className="flex flex-row items-center justify-center">
                  <FastfoodRoundedIcon
                    className={clsx(`text-${randomColor}`)}
                  />
                  <h1 className="font-semibold ml-2">{expense.name}</h1>
                  {/* <h1>{date}</h1> */}
                </div>
                <div className="flex flex-col">
                  <p className="font-thin text-sm text-neutral-500">
                    {expense.category.name}
                  </p>
                  <p className="font-semibold text-red-600">
                    - {expense.amount}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        !loading && <p className="text-gray-500 mt-4">No transactions found.</p>
      )}
    </>
  );
};

export default TransactionList;
