import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import FsLoading from "../Loaders/FsLoading";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
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

const MonthSummary = ({ monthQuery, fetchMonthQuery, user }) => {
  const [month, setMonth] = useState(null);
  const [percentage, setPercentage] = useState();
  const [activeMonths, setActiveMonths] = useState([]);
  const [recurringPayments, setRecurringPayments] = useState([]);
  const [changeMonthActive, setChangeMonthActive] = useState(false);
  const [exchangeRates, setExchangeRates] = useState(null);
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
    if (monthsData?.getMonthsByUser) {
      setActiveMonths(monthsData.getMonthsByUser);
    }
  }, [monthsData]);

  useEffect(() => {
    if (recurringPaymentData?.getAllRecurringPayment) {
      setRecurringPayments(recurringPaymentData.getAllRecurringPayment);
    }
  }, [recurringPaymentData]);

  if (loading) return <FsLoading />;
  return (
    <div className="w-full px-4 flex flex-col font-sans pb-[100px] h-[calc(100vh-100px)] overflow-y-auto">
      <div className="flex flex-row justify-between items-center border-b-2 p-3 mb-4 sticky top-0 bg-white">
        <h1 className="text-2xl text-teal-800">
          {month && month.month
            ? formatDateToString(month.month)
            : "Invalid Date"}
        </h1>
        <div className="relative">
          <button
            className="text-xs text-teal-800"
            onClick={() => {
              setChangeMonthActive((prev) => !prev);
            }}
          >
            Change month <SwapHorizRoundedIcon />
          </button>
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
        <div className="w-full flex flex-row justify-between text-sm font-normal">
          <h1>
            <AccountBalanceWalletRoundedIcon className="text-teal-500 mr-1" />
            Total Balance
          </h1>
          <h1>
            Monthly limit: {getSymbolFromCurrency(month?.currency)}{" "}
            {month?.budget || 0}
          </h1>
        </div>
        <h1 className="text-5xl font-semibold text-black">
          {getSymbolFromCurrency(month?.currency)} {month?.balance}
        </h1>

        <div className="text-xs flex flex-row w-full justify-between">
          <h1>
            {" "}
            {getSymbolFromCurrency(month?.currency)} {month?.balance || 0}
          </h1>
          <h1>
            {" "}
            {getSymbolFromCurrency(month?.currency)} {month?.budget || 0}
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
          <p className="text-xs font-thinner">{percentage}%</p>
        </div>

        <div className="flex flex-row text-white w-full font-semibold">
          <button className="w-1/3 flex items-center justify-center border rounded-xl p-2 bg-black shadow-md">
            {" "}
            Deposit{" "}
          </button>
        </div>
      </div>

      {/* TRANSACTIONS */}
      <div className="flex flex-row justify-between w-full my-2">
        <h1 className="font-semibold"> Transactions</h1>
        <h1 className="font-light tracking-tighter text-sm text-gray-600">
          {" "}
          See all <ArrowRightIcon className="text-black" />
        </h1>
      </div>

      {/* TRANSACTIONS LIST */}
      <div className="flex flex-col w-full py-4 mb-2">
        <TransactionList
          limit={3}
          currency={month?.currency}
          transactionData={month?.expenses || null}
          loading={loading}
          error={error}
          sort={true}
        />
      </div>

      {/* RECURRING PAYMENTS */}
      <div className="flex flex-row justify-between w-full my-2">
        <h1 className="font-semibold"> Upcoming payments </h1>
        <h1 className="font-light tracking-tighter text-sm text-gray-600">
          {" "}
          See all <ArrowRightIcon className="text-black" />
        </h1>
      </div>
      <RecurringPaymentsList user={user} />
    </div>
  );
};

export default MonthSummary;
