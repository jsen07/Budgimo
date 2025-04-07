import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TransactionList from "./subcomponents/TransactionList";
import MobileNav from "../NavigationComponent/MobileNav";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const Transactions = () => {
  // let date = Date.now();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState();
  const [addTransactionToggle, setAddTransactionToggle] = useState(false);

  const getTransactionData = (transactions) => {
    setTransactions(transactions);
  };

  useEffect(() => {
    if (transactions) {
      console.log(transactions);
    }
  }, [transactions]);

  return (
    <div className="flex flex-col font-sans items-center pt-4">
      <div className="sticky top-0 w-full flex flex-col pt-4 bg-white">
        <div className="flex flex-row justify-between items-center text-2xl px-2 relative">
          <ArrowBackIosRoundedIcon onClick={() => navigate("/dashboard")} />
          <h1 className="font-semibold tracking-wide absolute left-1/2 -translate-x-1/2">
            {" "}
            Transactions{" "}
          </h1>
          <div
            className="flex flex-row gap-2
          "
          >
            <EditRoundedIcon style={{ fontSize: "32px" }} />
            <AddBoxRoundedIcon
              style={{ fontSize: "32px" }}
              onClick={() => setAddTransactionToggle((prev) => !prev)}
            />
          </div>
        </div>

        <div className="mt-8 px-2 flex flex-row items-center gap-2">
          <input
            className="w-full border h-10 px-4 rounded-lg focus:border"
            placeholder="Search"
          ></input>
          <SearchRoundedIcon style={{ fontSize: "36px" }} />
        </div>
      </div>

      <div className="w-full mt-4 px-2">
        <h1 className="mb-2 tracking-tighter font-semibold text-gray-900">
          Recent transactions
        </h1>
        <div className="w-full px-1 flex flex-col">
          <TransactionList
            limit={null}
            getTransactionData={getTransactionData}
          />
        </div>
      </div>

      {/* ADD TRANSACTION MODAL */}
      {addTransactionToggle && (
        <div className="absolute bottom-0 h-2/3 w-full border-t-lg rounded-xl bg-white p-4 border-2 flex flex-col">
          <div className="w-full flex justify-end items center">
            <CloseRoundedIcon
              onClick={() => setAddTransactionToggle((prev) => !prev)}
            />
          </div>

          <div className="w-full"></div>
        </div>
      )}

      <MobileNav />
    </div>
  );
};

export default Transactions;
