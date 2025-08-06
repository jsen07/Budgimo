import React, { useEffect, useMemo, useState } from "react";
import DeleteExpense from "../../Prompts/DeleteExpense";
import { useNavigate } from "react-router-dom";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import TransactionSkeleton from "../../Loaders/TransactionSkeleton";
import categoryIcons from "../../../presets/categoryIcons";
import useDelayedLoading from "../../../hooks/DelayedLoading";
import {
  formatDateTransactions,
  groupTransactionsByDate,
} from "../../../utils/helperFunctions";
const getSymbolFromCurrency = require("currency-symbol-map");

const TransactionList = ({
  limit,
  transactionData,
  loading,
  error,
  currency,
  convertToGbp,
  deleteTransactionView,
}) => {
  const navigate = useNavigate();
  const [exchangeRates, setExchangeRates] = useState({});
  const showLoading = useDelayedLoading(loading, 500);
  const targetCurrency = currency?.toLowerCase();
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [deleteEnabled, setDeleteEnabled] = useState(false);
  const [expense, setExpense] = useState("");
  const [expenseId, setExpenseId] = useState("");

  useEffect(() => {
    if (!loading) {
      setHasLoadedOnce(true);
    }
  }, [loading]);

  useEffect(() => {
    const fetchRates = async () => {
      const fromCurrencies = new Set(
        transactionData?.map((expense) => expense.currency?.toLowerCase())
      );

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
    let foreignExpense;
    const rate = exchangeRates[from];
    if (typeof rate !== "number") return null;

    !convertToGbp ? (foreignExpense = true) : (foreignExpense = false);
    const foreignRate = foreignExpense ? expense.rate : rate;

    // const foreignRate = foreignExpense ? rate : expense.rate;
    return Number(expense.amount) * foreignRate;
  };

  const processedTransactions = useMemo(() => {
    if (!Array.isArray(transactionData) || transactionData.length === 0)
      return [];

    const currentDate = new Date();

    const pastDates = transactionData
      .filter((t) => new Date(t.date) <= currentDate)
      .sort(
        (a, b) =>
          currentDate - new Date(a.date) - (currentDate - new Date(b.date))
      );

    const futureDates = transactionData
      .filter((t) => new Date(t.date) > currentDate)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const sortByClosest = [...futureDates, ...pastDates];

    const closestThree = sortByClosest.slice(
      0,
      limit ? limit : transactionData.length
    );
    return closestThree;
  }, [transactionData, limit]);

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
        </>
      )}

      {error && (
        <div className="alert alert-danger">
          <p>Error loading transactions: {error.message}</p>
        </div>
      )}

      {!showLoading && (
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
              <div
                key={date}
                className="bg-white border-2 rounded-lg flex flex-col mb-4"
              >
                <h2 className="font-bold px-3 text-md w-full flex justify-between text-neutral-800 rounded-t-lg bg-white py-4">
                  {date}
                  <span
                    className={`font-semibold ${
                      dateTotal < 0 ? "text-red-700" : "text-blue-700"
                    }`}
                  >
                    {formattedTotal}
                  </span>
                </h2>

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
                      className="flex flex-row bg-white justify-between items-center border-t-2  rounded-b-lg p-3 cursor-pointer"
                      // onClick={() =>
                      //   navigate(
                      //     `/transactions/edit/${expense._id || expense.id}`
                      //   )
                      // }
                    >
                      <div className="flex items-center justify-center">
                        <div className="flex items-center justify-center p-2 rounded-lg bg-neutral-800">
                          {matchedIcon}
                        </div>
                        <div className="flex flex-col justify-center ml-2">
                          <h1 className="font-semibold text-black">
                            {expense.name}
                          </h1>
                          <p className="text-xs font-medium text-neutral-600">
                            {expense.category?.name || "Uncategorized"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex flex-row gap-2">
                        <div className="flex flex-col">
                          <p
                            className={`font-semibold ${
                              expense.moneyOut
                                ? "text-red-600"
                                : "text-green-700"
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

                        {deleteTransactionView && (
                          <>
                            <button
                              className={`text-red-600 rounded-full ${
                                deleteTransactionView
                                  ? `animate-slide-in-right`
                                  : `animate-slide-out-right`
                              }`}
                              onClick={() => {
                                setDeleteEnabled(true);
                                setExpense(expense.name);
                                setExpenseId(expense.id);
                              }}
                            >
                              <RemoveCircleIcon />
                            </button>
                            {/* {deleteEnabled && <DeleteExpense />} */}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {deleteEnabled && (
        <DeleteExpense
          name={expense}
          id={expenseId}
          setDeleteEnabled={setDeleteEnabled}
        />
      )}
      {hasLoadedOnce &&
        !showLoading &&
        !error &&
        processedTransactions.length === 0 && (
          <p className="text-gray-500 mt-4">No transactions found.</p>
        )}
    </>
  );
};

export default React.memo(TransactionList);
