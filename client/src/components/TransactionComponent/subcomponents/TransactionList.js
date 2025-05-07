import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TransactionSkeleton from "../../Loaders/TransactionSkeleton";
import categoryIcons from "../../../presets/categoryIcons";
import useDelayedLoading from "../../../hooks/DelayedLoading";
import {
  formatDateTransactions,
  groupTransactionsByDate,
  sortTransactionsByDate,
} from "../../../utils/helperFunctions";
const getSymbolFromCurrency = require("currency-symbol-map");

const TransactionList = ({
  limit,
  transactionData,
  loading,
  error,
  currency,
  sort,
}) => {
  const navigate = useNavigate();
  const [exchangeRates, setExchangeRates] = useState({});
  const showLoading = useDelayedLoading(loading, 1000);
  const targetCurrency = currency?.toLowerCase() || "gbp";

  useEffect(() => {
    const fetchRates = async () => {
      const fromCurrencies = new Set(
        transactionData?.map((expense) => expense.currency?.toLowerCase())
      );
      // console.log(fromCurrencies);

      const rates = {};

      for (const from of fromCurrencies) {
        if (from === targetCurrency) continue;

        try {
          const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${from}.json`;
          const res = await fetch(url);
          const data = await res.json();
          const rate = data?.[from]?.[targetCurrency];
          if (rate) rates[from] = rate;
        } catch (err) {
          console.error(
            `Failed to fetch rate from ${from} to ${targetCurrency}`
          );
        }
      }

      setExchangeRates(rates);
    };

    if (transactionData?.length) fetchRates();
  }, [transactionData, targetCurrency]);

  const convertToTarget = (expense) => {
    const from = expense.currency?.toLowerCase();
    if (from === targetCurrency) return null;
    const rate = exchangeRates[from];
    return rate ? Number(expense.amount) * rate : null;
  };

  const processedTransactions = useMemo(() => {
    if (!Array.isArray(transactionData)) return [];
    const data = limit ? transactionData.slice(-limit) : transactionData;
    return sort ? sortTransactionsByDate(data) : data;
  }, [transactionData, limit, sort]);

  const grouped = useMemo(() => {
    return groupTransactionsByDate(
      processedTransactions,
      formatDateTransactions
    );
  }, [processedTransactions]);

  const currencySymbol = getSymbolFromCurrency(currency || targetCurrency);

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
        {Object.keys(grouped).map((date) => {
          const dateTotal = grouped[date].reduce((sum, expense) => {
            const converted = convertToTarget(expense);
            const value = converted ?? Number(expense.amount || 0);
            return expense.moneyOut ? sum - value : sum + value;
          }, 0);

          const formattedTotal =
            dateTotal < 0
              ? `- ${currencySymbol}${Math.abs(dateTotal).toFixed(2)}`
              : `${currencySymbol}${dateTotal.toFixed(2)}`;

          return (
            <div key={date}>
              <h2 className="font-bold text-md my-4 w-full flex justify-between text-neutral-800">
                {date}
                <span
                  className={`font-semibold ${
                    dateTotal < 0 ? "text-red-700" : "text-blue-700"
                  }`}
                >
                  {formattedTotal}
                </span>
              </h2>
              <div className="border-t-2">
                {grouped[date].map((expense) => {
                  const converted = convertToTarget(expense);
                  const originalAmount = Number(expense.amount || 0);
                  const customIcon = categoryIcons.find(
                    (icon) => icon.name === "Custom"
                  )?.icon;
                  const matchedIcon =
                    categoryIcons.find(
                      (icon) => icon.name === expense?.category?.name
                    )?.icon || customIcon;
                  return (
                    <div
                      key={expense._id || expense.id}
                      className="flex flex-row justify-between items-center p-3 cursor-pointer border-b-2"
                      onClick={() =>
                        navigate(
                          `/transactions/edit/${expense._id || expense.id}`
                        )
                      }
                    >
                      <div className="flex items-center justify-center">
                        <div className="flex items-center justify-center p-2 rounded-lg bg-neutral-800">
                          {matchedIcon}
                        </div>
                        <div className="flex flex-col justify-center ml-2">
                          <h1 className="font-semibold text-teal-700">
                            {expense.name}
                          </h1>
                          <p className="text-xs font-medium text-neutral-600">
                            {expense.category?.name || "Uncategorized"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col">
                        <p
                          className={`font-semibold ${
                            expense.moneyOut ? "text-red-600" : "text-green-700"
                          }`}
                        >
                          {expense.moneyOut ? "-" : "+"}{" "}
                          {getSymbolFromCurrency(expense.currency)}
                          {originalAmount.toFixed(2)}
                        </p>
                        {converted && (
                          <span className="text-xs italic text-gray-500">
                            ≈ {currencySymbol}
                            {converted.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {processedTransactions.length === 0 && !loading && !error && (
        <p className="text-gray-500 mt-4">No transactions found.</p>
      )}
    </>
  );
};

export default TransactionList;
