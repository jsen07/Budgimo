import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import auth from "../../utils/auth/auth";
import TransactionList from "./subcomponents/TransactionList";
import AddTransaction from "./subcomponents/AddTransaction";
import MobileNav from "../NavigationComponent/MobileNav";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { getAllExpensesByUser } from "../../utils/queries/queries";

const Transactions = () => {
  // let date = Date.now();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState();
  const [user, setUser] = useState(null);
  const [addTransactionToggle, setAddTransactionToggle] = useState(false);
  const [closing, setClosing] = useState(false);
  const { data, loading, error } = useQuery(getAllExpensesByUser, {
    skip: !user,
    variables: {
      userId: user ? user.data._id : "",
      limit: null,
      orderBy: "date_DESC",
    },
  });

  useEffect(() => {
    setUser(auth.getProfile());
  }, []);

  useEffect(() => {
    if (data) {
      setTransactions(data.getAllExpensesByUser);
    }
  }, [data]);

  const toggleAddTransactionMenu = () => {
    if (addTransactionToggle) {
      setClosing(true);
      setTimeout(() => {
        setAddTransactionToggle(false);
        setClosing(false);
      }, 300);
    } else {
      setAddTransactionToggle(true);
    }
  };

  return (
    <div className="flex flex-col font-sans items-center pb-[100px]">
      <div className="sticky top-0 w-full flex flex-col pt-8 bg-white">
        <div className="flex flex-row justify-between items-center text-2xl px-2 relative">
          <ArrowBackIosRoundedIcon onClick={() => navigate("/dashboard")} />
          <h1 className="font-semibold tracking-wide absolute left-1/2 -translate-x-1/2">
            {" "}
            Transactions{" "}
          </h1>
          <div
            className="flex flex-row gap-2 text-teal-600 mr-2
          "
          >
            <EditRoundedIcon style={{ fontSize: "28px" }} />
            <AddBoxRoundedIcon
              style={{ fontSize: "28px" }}
              onClick={() => toggleAddTransactionMenu()}
            />
          </div>
        </div>

        <div className="mt-8 px-2 flex flex-row items-center gap-2 mb-2">
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
            transactionData={transactions}
            loading={loading}
            error={error}
            sort={true}
          />
        </div>
      </div>

      {/* ADD TRANSACTION MODAL */}
      {addTransactionToggle && (
        <div
          className={`fixed bottom-0 h-auto pb-[100px] w-full border-t-lg rounded-xl bg-white p-4 border-2 flex flex-col ${
            closing ? "animate-slide-out-bottom" : "animate-slide-in-bottom"
          }`}
        >
          <AddTransaction
            toggleAddTransactionMenu={toggleAddTransactionMenu}
            user={user}
          />
          <div className="w-full"></div>
        </div>
      )}

      <MobileNav />
    </div>
  );
};

export default Transactions;
