import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import TransactionList from "../TransactionComponent/subcomponents/TransactionList";
import {
  calculatePercentage,
  formatDateToString,
} from "../../utils/helperFunctions";
import {
  getExpensesByMonth,
  getMonthsByUser,
  getAllRecurringPayment,
} from "../../utils/queries/queries";
import RecurringPaymentsList from "../ScheduleComponent/subcomponents/RecurringPaymentsList";
const getSymbolFromCurrency = require("currency-symbol-map");

const MonthSummary = ({
  monthQuery,
  fetchMonthQuery,
  user,
  setParentLoading,
}) => {
  const [month, setMonth] = useState(null);
  const [percentage, setPercentage] = useState();
  const [activeMonths, setActiveMonths] = useState([]);
  const [recurringPayments, setRecurringPayments] = useState([]);
  const [changeMonthActive, setChangeMonthActive] = useState(false);
  const [viewTransactionToggle, setViewTransactionToggle] = useState(false);
  const [closing, setClosing] = useState(false);
  const { data: monthsData, loading: monthsLoading } = useQuery(
    getMonthsByUser,
    {
      skip: !user,
      variables: {
        userId: user ? user._id : "",
      },
    }
  );
  const { data: recurringPaymentData, loading: recurringPaymentLoading } =
    useQuery(getAllRecurringPayment, {
      skip: !user,
      variables: {
        userId: user ? user._id : "",
      },
    });
  const { data, loading, error } = useQuery(getExpensesByMonth, {
    variables: {
      monthId: monthQuery,
    },
  });

  const toggleViewTransactionMenu = () => {
    if (viewTransactionToggle) {
      setClosing(true);
      setTimeout(() => {
        setViewTransactionToggle(false);
        setClosing(false);
      }, 300);
    } else {
      setViewTransactionToggle(true);
    }
  };
  useEffect(() => {
    if (data && data.getExpensesByMonth !== null) {
      setMonth(data.getExpensesByMonth);
      setPercentage(
        calculatePercentage(
          data.getExpensesByMonth.budget,
          data.getExpensesByMonth.balance
        )
      );
    }
  }, [data]);

  useEffect(() => {
    const anyLoading = loading || recurringPaymentLoading || monthsLoading;
    // console.log("Loading:", anyLoading);
    if (!anyLoading) setParentLoading(false);
  }, [loading, recurringPaymentLoading, monthsLoading]);

  useEffect(() => {
    if (monthsData?.getMonthsByUser) {
      setActiveMonths(monthsData.getMonthsByUser);
    }
  }, [monthsData]);

  useEffect(() => {
    if (recurringPaymentData?.getAllRecurringPayment) {
      setRecurringPayments(recurringPaymentData.getAllRecurringPayment);
    }
  }, [recurringPaymentData]);

  // if (loading) return <FsLoading />;
  if (loading || !data || !month) return null;
  return (
    <div className="w-full px-4 flex flex-col font-sans pb-[100px]">
      <div className="flex flex-row justify-between items-center border-b-2 p-3 mb-4 sticky top-[60px] bg-white">
        <h1 className="text-2xl text-teal-700">
          {month && month.month
            ? formatDateToString(month.month)
            : "Invalid Date"}
        </h1>
        <div className="relative">
          {activeMonths.length > 1 && (
            <button
              className="text-xs text-teal-800"
              onClick={() => {
                setChangeMonthActive((prev) => !prev);
              }}
            >
              Change month <SwapHorizRoundedIcon />
            </button>
          )}

          {changeMonthActive && (
            <div className="absolute top-[35px] right-0 rounded-xl border animate-quickFade shadow-lg px-2 bg-white">
              {activeMonths
                .filter((currentMonth) => currentMonth.id !== monthQuery)
                .map((month, key) => (
                  <div key={month.id}>
                    <button
                      className="min-w-32 h-12 flex items-center justify-center text-sm box-content border-b"
                      onClick={() => {
                        fetchMonthQuery(month.id);
                        setChangeMonthActive((prev) => !prev);
                      }}
                    >
                      <h1>{formatDateToString(month.month)}</h1>
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
      {/* TOTAL BALANCE */}
      <div className="flex flex-col w-full p-2 gap-4 mb-4 ">
        <div className="w-full flex flex-row justify-between text-sm font-semibold">
          <h1>
            <AccountBalanceWalletRoundedIcon className="text-teal-500 mr-1" />
            Total Balance
          </h1>
          <h1 className="text-xs">
            Budget: {getSymbolFromCurrency(month?.currency)}
            {month?.budget || 0}
          </h1>
        </div>
        <h1 className="text-5xl font-semibold text-black">
          {getSymbolFromCurrency(month?.currency)}
          {month?.balance.toFixed(2)}
        </h1>

        <div className="text-xs flex flex-row w-full justify-between font-semibold">
          <h1>
            {getSymbolFromCurrency(month?.currency)}
            {month?.balance.toFixed(2) || 0}
          </h1>
          <h1>
            {getSymbolFromCurrency(month?.currency)}
            {month?.budget || 0}
          </h1>
        </div>
        <div className="w-full bg-gray-500 rounded-full h-2.5 mb-4">
          <div
            className="bg-teal-500 h-2.5 rounded-full"
            style={{
              width: `${percentage}%`,
              maxWidth: "100%",
            }}
          ></div>
          <p className="text-xs mt-1 font-semibold">{percentage}%</p>
        </div>
        <button className="w-1/3  text-white font-semibold flex items-center justify-center border rounded-xl p-2 bg-neutral-800 shadow-md">
          Deposit
        </button>
      </div>

      {/* TRANSACTIONS */}
      <div className="flex flex-row justify-between w-full my-2">
        <h1 className="font-semibold"> Transactions</h1>
        <button
          className="font-light tracking-tighter text-sm text-gray-600"
          onClick={() => {
            toggleViewTransactionMenu();
          }}
        >
          {" "}
          See all <ArrowRightIcon className="text-black" />
        </button>
      </div>

      {/* TRANSACTIONS LIST */}
      <div className="flex flex-col w-full py-4 mb-2">
        <TransactionList
          limit={3}
          currency={month?.currency}
          transactionData={month?.expenses || null}
          loading={loading}
          error={error}
        />
      </div>

      {viewTransactionToggle && (
        <div
          className={`fixed bottom-0 left-0 h-3/4 overflow-y-auto w-full bg-white border-t-lg rounded-xl px-4 border-2 flex flex-col pb-[20px] z-10 ${
            closing ? "animate-slide-out-bottom" : "animate-slide-in-bottom"
          }`}
        >
          <div className="w-full flex items-end justify-between sticky top-0 py-4 bg-white">
            <h1 className="text-md font-semibold text-neutral-900">
              {" "}
              {formatDateToString(month.month)} transactions
            </h1>
            <CloseRoundedIcon onClick={() => toggleViewTransactionMenu()} />
          </div>
          <TransactionList
            currency={month?.currency}
            transactionData={month?.expenses || null}
            loading={loading}
            error={error}
            toggleViewTransactionMenu={toggleViewTransactionMenu}
          />
        </div>
      )}

      {/* RECURRING PAYMENTS */}
      {month && (
        <>
          <RecurringPaymentsList
            user={user}
            month={month?.month}
            filter={false}
          />
        </>
      )}
    </div>
  );
};

export default MonthSummary;
