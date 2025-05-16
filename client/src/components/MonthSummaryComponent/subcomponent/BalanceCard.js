import React from "react";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
const getSymbolFromCurrency = require("currency-symbol-map");

const BalanceCard = ({ month, percentage }) => {
  const currencySymbol = getSymbolFromCurrency(month?.currency);

  return (
    <div className="flex flex-col w-full p-2 gap-4 mb-4">
      <div className="w-full flex flex-row justify-between text-sm font-semibold">
        <h1>
          <AccountBalanceWalletRoundedIcon className="text-teal-500 mr-1" />
          Total Balance
        </h1>
        <h1 className="text-xs">
          Budget: {currencySymbol}
          {month?.budget || 0}
        </h1>
      </div>

      <h1 className="text-5xl font-semibold text-black">
        {currencySymbol}
        {month?.balance}
      </h1>

      <div className="text-xs flex flex-row w-full justify-between font-semibold">
        <h1>
          {currencySymbol}
          {month?.balance || 0}
        </h1>
        <h1>
          {currencySymbol}
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

      <button className="w-1/3 text-white font-semibold flex items-center justify-center border rounded-xl p-2 bg-neutral-800 shadow-md">
        Deposit
      </button>
    </div>
  );
};

export default React.memo(BalanceCard);
