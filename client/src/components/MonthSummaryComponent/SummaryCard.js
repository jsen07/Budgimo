import React from "react";
import PaidIcon from "@mui/icons-material/Paid";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";

const SummaryCard = ({
  title,
  amount,
  currency,
  percentage,
  percentageLabel,
}) => {
  const isPositive = percentage >= 0;

  return (
    <div className="flex flex-col w-full min-w-[275px] lg:min-w-[250px] bg-white border-2 rounded-2xl py-4 px-5 mb-4 shadow-lg text-neutral-600 justify-between">
      <h1 className="flex items-center text-black gap-2">
        {title}
        <PaidIcon className="text-green-600" fontSize="medium" />
      </h1>

      <h2 className="text-3xl text-black">
        {currency}
        {amount.toFixed(2)}
      </h2>

      <div className="flex flex-row justify-between w-full text-sm items-center">
        <h2>{percentageLabel}</h2>
        <h2 className="flex items-center">
          {isPositive ? (
            <>
              +{percentage}%{" "}
              <ArrowCircleUpIcon className="ml-1 text-green-500" />
            </>
          ) : (
            <>
              {percentage}%{" "}
              <ArrowCircleDownIcon className="ml-1 text-red-500" />
            </>
          )}
        </h2>
      </div>
    </div>
  );
};

export default SummaryCard;
