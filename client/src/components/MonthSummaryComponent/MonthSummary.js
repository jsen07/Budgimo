import React, { useEffect, useState } from "react";
import auth from "../../utils/auth/auth";
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
} from "../../utils/queries/queries";

const MonthSummary = ({ monthQuery, fetchMonthQuery }) => {
  const [user, setUser] = useState();
  const [month, setMonth] = useState(null);
  const [percentage, setPercentage] = useState();
  const [activeMonths, setActiveMonths] = useState([]);
  const [changeMonthActive, setChangeMonthActive] = useState(false);
  const { data: monthsData, loading: monthsLoading } = useQuery(
    getMonthsByUser,
    {
      skip: !user,
      variables: {
        userId: user ? user._id : "",
      },
    }
  );
  const { data, loading, error } = useQuery(getExpensesByMonth, {
    variables: {
      monthId: monthQuery,
    },
  });

  useEffect(() => {
    const user = auth.getProfile();
    setUser(user.data);
  }, []);

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

      console.log(monthsData.getMonthsByUser);
    }
  }, [monthsData]);

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
            <div className="absolute top-[35px] right-0 rounded-lg border shadow-md animate-quickFade">
              {activeMonths
                .filter((currentMonth) => currentMonth.id !== monthQuery)
                .map((month, key) => (
                  <div key={key}>
                    <button
                      className="w-40 h-12 bg-white flex items-center justify-center text-sm border-b"
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
          <h1>Budget: £{month?.budget || 0}</h1>
        </div>
        <h1 className="text-5xl font-semibold text-black">£{month?.balance}</h1>

        <div className="text-xs flex flex-row w-full justify-between">
          <h1>£{month?.balance || 0}</h1>
          <h1> £{month?.budget || 0}</h1>
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
          transactionData={month?.expenses || null}
          loading={loading}
          error={error}
          sort={true}
        />
      </div>

      {/* UPCOMING PAYMENTS */}
      <div className="flex flex-row justify-between w-full my-2">
        <h1 className="font-semibold"> Upcoming payments </h1>
        <h1 className="font-light tracking-tighter text-sm text-gray-600">
          {" "}
          See all <ArrowRightIcon className="text-black" />
        </h1>
      </div>

      <div className="flex flex-row justify-between items-center border rounded-lg p-3 mb-2 bg-teal-400">
        <h1 className="font-semibold">Sainsbury's</h1>
        <div className="flex flex-col">
          <p className="font-thin text-sm text-neutral-500">Groceries</p>
          <p className="font-semibold"> - £14.99</p>
        </div>
      </div>

      <div className="flex flex-row justify-between items-center border rounded-lg p-3 mb-2 bg-yellow-300">
        <h1 className="font-semibold">Sainsbury's</h1>
        <div className="flex flex-col">
          <p className="font-thin text-sm text-neutral-500">Groceries</p>
          <p className="font-semibold"> - £14.99</p>
        </div>
      </div>

      <div className="flex flex-row justify-between items-center border rounded-lg p-3 mb-2 bg-pink-400">
        <h1 className="font-semibold">Sainsbury's</h1>
        <div className="flex flex-col">
          <p className="font-thin text-sm text-neutral-500">Groceries</p>
          <p className="font-semibold"> - £14.99</p>
        </div>
      </div>
    </div>
  );
};

export default MonthSummary;
