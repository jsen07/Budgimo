import React from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const showLoading = useDelayedLoading(loading, 1000);

  const transactionsToShow = Array.isArray(transactionData)
    ? limit
      ? transactionData.slice(-limit)
      : transactionData
    : [];

  // Sort transactions if sort is true
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

      <div className="gap-2">
        {Object.keys(groupedTransactions).map((date) => {
          const randomColor = getRandomColor();
          const dateTotal = groupedTransactions[date].reduce((sum, expense) => {
            return expense.moneyOut
              ? sum - Number(expense.amount)
              : sum + Number(expense.amount);
          }, 0);

          let over = dateTotal > 0 ? true : false;
          const formattedTotal =
            dateTotal > 0
              ? ` £${dateTotal.toFixed(2)}`
              : `- £${Math.abs(dateTotal).toFixed(2)}`;

          return (
            <div key={date}>
              <h2 className="font-semibold text-md my-4 w-full flex justify-between">
                {date}{" "}
                <span
                  className={`font-semibold text-md ${
                    over ? `text-blue-700` : `text-gray-700`
                  }`}
                >
                  {formattedTotal}
                </span>
              </h2>
              <div
                className={clsx(
                  `border-${randomColor} border rounded-lg shadow-sm`
                )}
              >
                {groupedTransactions[date].map((expense) => {
                  const randomColor = getRandomColor();
                  return (
                    <div
                      key={expense.id}
                      className={clsx(
                        "flex flex-row justify-between items-center rounded-lg p-3"
                      )}
                      onClick={() => {
                        navigate(`/transactions/edit/${expense.id}`);
                      }}
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
                            expense.moneyOut ? "text-red-600" : "text-green-700"
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
            </div>
          );
        })}
      </div>

      {transactionsToShow?.length === 0 && !loading && !error && (
        <p className="text-gray-500 mt-4">No transactions found.</p>
      )}
    </>
  );
};

export default TransactionList;
