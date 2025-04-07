import React, { useEffect, useState } from "react";
import auth from "../../utils/auth/auth";
import MobileNav from "../NavigationComponent/MobileNav";
import Avatar from "@mui/material/Avatar";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import TransactionList from "../TransactionComponent/subcomponents/TransactionList";
import { calculatePercentage } from "../../utils/helperFunctions";

const Dashboard = () => {
  const [firstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const limit = 3;
  let percentage = calculatePercentage(2000, 334);

  useEffect(() => {
    const user = auth.getProfile();
    setFirstName(user.data.first_name.charAt(0).toUpperCase());

    setLastName(user.data.last_name.charAt(0).toUpperCase());
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="w-full max-h-screen">
      <div className="w-full h-auto sticky top-0  bg-white flex flex-row py-4 px-6 justify-between items-center z-10">
        <h1 className="font-hero font-semibold text-2xl text-teal-600">
          Budgimo
        </h1>
        <Avatar>{firstName + LastName}</Avatar>
      </div>

      {/* Content */}

      <div className="w-full p-4 flex flex-col font-sans pb-[100px] h-[calc(100vh-100px)] overflow-y-auto">
        <div className="flex flex-row justify-between items-center border-b-2 p-3 mb-4">
          <h1 className="text-2xl text-teal-800">April 2025</h1>
          <h1 className="text-xs text-teal-800">
            Change month <SwapHorizRoundedIcon />
          </h1>
        </div>
        {/* TOTAL BALANCE */}
        <div className="flex flex-col w-full p-2 gap-4 mb-4 ">
          <div className="w-full flex flex-row justify-between text-sm font-normal">
            <h1>
              <AccountBalanceWalletRoundedIcon className="text-teal-500 mr-1" />
              Total Balance
            </h1>
            <h1>Budget: £2000</h1>
          </div>
          <h1 className="text-5xl font-semibold text-black">£1666</h1>

          <div class="text-xs flex flex-row w-full justify-between">
            <h1>£334.00</h1>
            <h1> £2000.00 </h1>
          </div>
          <div className="w-full bg-gray-500 rounded-full h-2.5 mb-4">
            <div
              className="bg-teal-500 h-2.5 rounded-full"
              style={{ width: `${percentage}%` }}
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
          <TransactionList limit={limit} />
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

      <MobileNav />
    </div>
  );
};

export default Dashboard;
