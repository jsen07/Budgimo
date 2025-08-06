import React, { useEffect, useState } from "react";
import useDelayedLoading from "../../hooks/DelayedLoading";
import { useDispatch, useSelector } from "react-redux";
import { addMonthLocal, setActiveMonths } from "../../store/monthSlice";
import { useQuery } from "@apollo/client";
import DashboardSkeleton from "../Loaders/DashboardSkeleton";
import Charts from "../AnalyticsComponent/Charts";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import TransactionList from "../TransactionComponent/subcomponents/TransactionList";
import RecurringPaymentsList from "../ScheduleComponent/subcomponents/RecurringPaymentsList";
import SummaryCard from "./SummaryCard";
import CategoryTotalsCard from "./CategoryTotalsCard";
import {
  calculatePercentage,
  formatDateToString,
  getTotalSpendings,
  getTotalEarnings,
  getHighestExpense,
  getTotalExpenseCategory,
} from "../../utils/helperFunctions";
import {
  getExpensesByMonth,
  getMonthsByUser,
} from "../../utils/queries/queries";
const getSymbolFromCurrency = require("currency-symbol-map");

const MonthSummary = ({
  monthQuery,
  fetchMonthQuery,
  user,
  setParentLoading,
}) => {
  const dispatch = useDispatch();
  const viewedMonths = useSelector((state) => state.month?.months || []);
  const activeMonths = useSelector((state) => state.month?.activeMonths || []);
  const [selectedMonthId, setSelectedMonthId] = useState(monthQuery);
  const [percentage, setPercentage] = useState();
  const [changeMonthActive, setChangeMonthActive] = useState(false);
  const [viewTransactionToggle, setViewTransactionToggle] = useState(false);
  const [closing, setClosing] = useState(false);
  const [lossPercentage, setLossPercentage] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [earningPercentage, setEarningPercentage] = useState(0);
  const [topExpense, setTopExpense] = useState(0);
  const [categoryCards, setCategoryCards] = useState([]);

  const currentMonth = viewedMonths.find((m) => m.id === selectedMonthId);
  const month = currentMonth;

  const { data: monthsData, loading: monthsLoading } = useQuery(
    getMonthsByUser,
    {
      skip: !user,
      variables: { userId: user ? user._id : "" },
    }
  );

  const { data, loading, error } = useQuery(getExpensesByMonth, {
    skip: viewedMonths.some((m) => m.id === selectedMonthId),
    variables: { monthId: selectedMonthId },
  });

  useEffect(() => {
    if (data?.getExpensesByMonth) {
      dispatch(addMonthLocal(data.getExpensesByMonth));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (month) {
      const percentageValue = calculatePercentage(month.budget, month.balance);
      setPercentage(percentageValue);

      const spent =
        month.expenses && month.expenses.length > 0
          ? getTotalSpendings(month)
          : 0;
      setTotalSpent(spent);

      const earning =
        month.expenses && month.expenses.length > 0
          ? getTotalEarnings(month)
          : 0;

      setEarnings(earning);

      if (month.budget > 0) {
        const percentSpent = (spent / month.budget) * 100;
        const percentEarned = (earning / month.budget) * 100;
        setLossPercentage(percentSpent.toFixed(2));
        setEarningPercentage(percentEarned.toFixed(2));
      }

      const categoryCard = getTotalExpenseCategory(month);
      setCategoryCards(categoryCard);
      setTopExpense(getHighestExpense(month));
    }
  }, [month]);

  useEffect(() => {
    if (monthsData?.getMonthsByUser) {
      dispatch(setActiveMonths(monthsData.getMonthsByUser));
    }
  }, [monthsData, dispatch]);

  // useEffect(() => {
  //   const anyLoading = loading || monthsLoading;
  //   if (!anyLoading) setParentLoading(false);
  // }, [loading, monthsLoading]);

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
  const anyLoading = loading || monthsLoading;
  if (useDelayedLoading(anyLoading, 500)) return <DashboardSkeleton />;

  return (
    <>
      {month && (
        <div className="w-full z-0 2xl:h-screen 2xl:items-center flex flex-col font-sans pb-[100px] lg:pb-0 lg:px-4">
          <div
            className="px-4 flex flex-row z-10 w-full
          justify-between bg-white items-center p-3 mb-4 sticky top-[60px] bg-white 2xl:top-0 2xl:py-5"
          >
            <h1 className="text-2xl text-teal-700 lg:text-3xl">
              {month?.month ? formatDateToString(month.month) : "Invalid Date"}
            </h1>
            <div className="relative">
              {activeMonths.length > 1 && (
                <button
                  className="text-sm text-teal-800"
                  onClick={() => setChangeMonthActive((prev) => !prev)}
                >
                  Change month <SwapHorizRoundedIcon fontSize="medium" />
                </button>
              )}

              {changeMonthActive && (
                <div className="absolute top-[35px] right-0 rounded-lg border animate-quickFade shadow-xl px-2 bg-white">
                  {activeMonths
                    .filter(
                      (currentMonth) => currentMonth.id !== selectedMonthId
                    )
                    .map((monthItem) => (
                      <div key={monthItem.id}>
                        <button
                          className="min-w-32 h-12 flex items-center justify-center text-sm box-content border-b"
                          onClick={() => {
                            const isAlreadyLoaded = viewedMonths.some(
                              (m) => m.id === monthItem.id
                            );
                            if (!isAlreadyLoaded) {
                              fetchMonthQuery(monthItem.id);
                            }
                            setSelectedMonthId(monthItem.id);
                            setChangeMonthActive(false);
                          }}
                        >
                          <h1>{formatDateToString(monthItem.month)}</h1>
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Wrapper */}

          <div className="2xl:flex flex-col overflow-y-auto w-full">
            {/* <h1 className="hidden mx-4 lg:flex text-2xl 2xl:text-3xl mb-4  border-b-2 py-2">
              Your Monthly Overview
            </h1> */}

            <div className="flex px-4 flex-col lg:gap-4 lg:flex-row w-full h-full lg:justify-between">
              <div className="flex flex-col w-full">
                {/* Budget & Balance Display */}
                <div className="flex bg-white flex-col w-full p-2 gap-4 mb-4 rounded-lg lg:p-4 lg:shadow-md lg:border text-xs ">
                  <div className="w-full flex flex-row justify-between text-sm font-semibold lg:text-base">
                    <h1>
                      <AccountBalanceWalletRoundedIcon className="text-teal-500 mr-1" />
                      Total Balance
                    </h1>
                    <h1 className="text-xs">
                      Budget: {getSymbolFromCurrency(month?.currency)}
                      {month?.budget || 0}
                    </h1>
                  </div>
                  <h1 className="text-5xl font-semibold text-black lg:text-4xl">
                    {getSymbolFromCurrency(month?.currency)}
                    {month?.balance?.toFixed(2)}
                  </h1>
                  <div className="text-xs flex flex-row w-full justify-between font-semibold">
                    <h1>
                      {getSymbolFromCurrency(month?.currency)}
                      {month?.balance || 0}
                    </h1>
                    <h1>
                      {getSymbolFromCurrency(month?.currency)}
                      {month?.budget || 0}
                    </h1>
                  </div>
                  <div className="w-full bg-gray-500 rounded-full h-2.5 mb-4 text-xs">
                    <div
                      className="bg-teal-500 h-2.5 rounded-full"
                      style={{ width: `${percentage}%`, maxWidth: "100%" }}
                    ></div>
                    <p className="mt-1 font-semibold">{percentage}%</p>
                  </div>
                  <button className="w-32 text-white font-semibold flex items-center justify-center border rounded-xl py-3 bg-neutral-800 shadow-md">
                    Deposit
                  </button>
                </div>

                <div className="flex flex-row lg:w-full text-base font-semibold gap-8 justify-between xs:grow overflow-x-auto min-h-[210px]">
                  {/* stat cards here */}
                  <SummaryCard
                    title="Current Expenditure"
                    amount={totalSpent}
                    currency={getSymbolFromCurrency(month?.currency)}
                    percentage={-Math.abs(lossPercentage)}
                    percentageLabel="Expenditure (%)"
                  />

                  <SummaryCard
                    title="Income"
                    amount={earnings}
                    currency={getSymbolFromCurrency(month?.currency)}
                    percentage={earningPercentage}
                    percentageLabel="Income (%)"
                  />

                  <SummaryCard
                    title="Highest Expense"
                    amount={topExpense?.convertedAmount || 0}
                    currency={getSymbolFromCurrency(month?.currency)}
                    percentage={0}
                    percentageLabel={topExpense?.name || "No data"}
                  />
                </div>

                {/* Transactions Section */}
                <div className="flex flex-row justify-between w-full my-2">
                  <h1 className="font-semibold"> Transactions</h1>
                  {month.expenses && month?.expenses.length > 0 && (
                    <button
                      className="font-light tracking-tighter text-sm text-gray-600"
                      onClick={toggleViewTransactionMenu}
                    >
                      See all <ArrowRightIcon className="text-black" />
                    </button>
                  )}
                </div>
                <TransactionList
                  limit={3}
                  currency={month?.currency}
                  transactionData={month?.expenses || null}
                  loading={loading}
                  error={error}
                />

                {viewTransactionToggle && (
                  <div
                    className={`fixed bottom-0 left-0 h-3/4 overflow-y-auto w-full bg-white border-t-lg rounded-xl px-4 border-2 flex flex-col pb-[20px] z-20 ${
                      closing
                        ? "animate-slide-out-bottom"
                        : "animate-slide-in-bottom"
                    }`}
                  >
                    <div className="w-full flex items-end justify-between sticky top-0 py-4 bg-white">
                      <h1 className="text-md font-semibold text-neutral-900">
                        {formatDateToString(month.month)} transactions
                      </h1>
                      <CloseRoundedIcon onClick={toggleViewTransactionMenu} />
                    </div>
                    <TransactionList
                      currency={month?.currency.toLowerCase()}
                      transactionData={month?.expenses || null}
                      loading={loading}
                      error={error}
                      toggleViewTransactionMenu={toggleViewTransactionMenu}
                    />
                  </div>
                )}

                {/* Recurring Payments */}
                <RecurringPaymentsList
                  user={user}
                  month={month?.month}
                  filter={false}
                />
              </div>

              {month.expenses.length > 0 && (
                <div className="w-full z-0 pb-[100px] lg:max-w-[800px] ">
                  <Charts
                    monthData={month.expenses}
                    currency={month?.currency}
                  />

                  <div className="my-4">
                    {categoryCards.map(({ category, income, expense, net }) => (
                      <CategoryTotalsCard
                        key={category}
                        title={category}
                        currency={month?.currency}
                        income={income}
                        expense={expense}
                        net={net}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MonthSummary;
