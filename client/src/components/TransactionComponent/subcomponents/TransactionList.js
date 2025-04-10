import React from "react";
import FastfoodRoundedIcon from "@mui/icons-material/FastfoodRounded";
import { getRandomColor } from "../../../utils/helperFunctions";
import clsx from "clsx";
import TransactionSkeleton from "../../Loaders/TransactionSkeleton";
import useDelayedLoading from "../../../hooks/DelayedLoading";
import {
  formatDateTransactions,
  groupTransactionsByDate,
  sortTransactionsByDate,
} from "../../../utils/helperFunctions";

const TransactionList = ({ limit, transactionData, loading, error, sort }) => {
  const showLoading = useDelayedLoading(loading, 1000);

  const transactionsToShow = Array.isArray(transactionData)
    ? limit
      ? transactionData.slice(0, limit)
      : transactionData
    : [];

  //  Sort transactions if sort is true
  const sortedTransactions = sort
    ? sortTransactionsByDate(transactionsToShow)
    : transactionsToShow;

  // Group transactions by formatted date
  const groupedTransactions = groupTransactionsByDate(
    sortedTransactions,
    formatDateTransactions
  );

  return (
    <>
      {showLoading && (
        <>
          <TransactionSkeleton />
          <TransactionSkeleton />
          <TransactionSkeleton />
        </>
      )}
      {error && (
        <div className="alert alert-danger">
          <p>Error loading transactions: {error.message}</p>
        </div>
      )}

      <div>
        {Object.keys(groupedTransactions).map((date) => (
          <div key={date}>
            <h2 className="font-semibold text-lg my-4">{date}</h2>
            {groupedTransactions[date].map((expense) => {
              const randomColor = getRandomColor();
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
                  </div>
                  <div className="flex flex-col">
                    <p className="font-thin text-sm text-neutral-500">
                      {expense.category.name}
                    </p>
                    <p
                      className={`font-semibold ${
                        expense.moneyOut ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {expense.moneyOut ? "-" : "+"}
                      {expense.amount}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {transactionsToShow?.length === 0 && !loading && !error && (
        <p className="text-gray-500 mt-4">No transactions found.</p>
      )}
    </>
  );
};

export default TransactionList;
