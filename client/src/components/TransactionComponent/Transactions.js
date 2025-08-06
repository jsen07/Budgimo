import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import auth from "../../utils/auth/auth";
import TransactionList from "./subcomponents/TransactionList";
import AddTransaction from "./subcomponents/AddTransaction";
import MobileNav from "../NavigationComponent/MobileNav";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { getAllExpensesByUser } from "../../utils/queries/queries";
import { setTransactions } from "../../store/expenseSlice";

const Transactions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = useState(null);
  const [addTransactionToggle, setAddTransactionToggle] = useState(false);
  const [closing, setClosing] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [deleteTransactionView, setDeleteTransactionView] = useState(false);
  const allTransactions = useSelector(
    (state) => state?.expense?.transactions || []
  );
  const { data, loading, error } = useQuery(getAllExpensesByUser, {
    skip: !user || allTransactions.length > 0,
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
    if (data && data.getAllExpensesByUser) {
      dispatch(setTransactions(data.getAllExpensesByUser));
    }
  }, [data, dispatch]);

  useEffect(() => {
    setFilteredTransactions(allTransactions);
  }, [allTransactions]);

  const toggleAddTransactionMenu = () => {
    if (addTransactionToggle) {
      setClosing(true);
      setTimeout(() => {
        setAddTransactionToggle(false);
        setClosing(false);
      }, 300);
    } else {
      setAddTransactionToggle(true);
      setDeleteTransactionView(false);
    }
  };

  const toggleDeleteTransaction = () => {
    if (addTransactionToggle) {
      setClosing(true);
      setTimeout(() => {
        setAddTransactionToggle(false);
        setClosing(false);
      }, 300);
      setDeleteTransactionView((prev) => !prev);
    } else {
      setDeleteTransactionView((prev) => !prev);
    }
  };
  const filterBysearch = (e) => {
    const query = e.target.value.toLowerCase();

    if (!query) {
      setFilteredTransactions(allTransactions);
      return;
    }

    const filtered = allTransactions.filter((transaction) => {
      const nameMatch = transaction.name?.toLowerCase().includes(query);
      const categoryMatch = transaction.category?.name
        ?.toLowerCase()
        .includes(query);
      return nameMatch || categoryMatch;
    });

    setFilteredTransactions(filtered);
  };

  return (
    <div className="flex flex-col bg-white px-2 font-sans items-center pb-[100px] h-screen lg:pb-0 lg:w-full lg:px-4">
      <div className="sticky top-0 w-full px-2 flex flex-col py-8 bg-white">
        <div className="flex flex-row justify-between items-center text-2xl px-2 relative">
          <ArrowBackIosRoundedIcon
            className="2xl:hidden"
            onClick={() => navigate("/dashboard")}
          />
          <h1 className="font-semibold tracking-wide absolute left-1/2 -translate-x-1/2">
            Transactions
          </h1>
        </div>
      </div>

      <div className="flex flex-col w-full">
        <div className="flex flex-row w-full items-center gap-2 mb-2">
          <input
            className="w-full border h-10 px-4 rounded-lg focus:border"
            placeholder="Search by name or category"
            onChange={filterBysearch}
          />
          <SearchRoundedIcon style={{ fontSize: "36px" }} />
        </div>
        <div className="flex flex-row items-center justify-between w-full mb-2">
          <h1 className="my-2 tracking-tighter font-semibold text-gray-900">
            Recent transactions
          </h1>
          <div className="flex flex-row gap-2 text-teal-600 mr-2 mt-2 text-base">
            <button
              onClick={() => {
                toggleDeleteTransaction();
              }}
              className="flex items-center px-3 py-1 gap-2 rounded-lg"
            >
              {" "}
              Edit
              <EditRoundedIcon fontSize="inherit" />
            </button>
            <button
              onClick={toggleAddTransactionMenu}
              className="px-3 py-1 bg-teal-500 text-white rounded-lg shadow hover:bg-teal-600 transition flex items-center gap-1 border"
            >
              Add
              <AddBoxRoundedIcon fontSize="inherit" />
            </button>
          </div>
        </div>
      </div>

      <div className="w-full h-full flex flex-col px-2 overflow-y-auto">
        <TransactionList
          limit={null}
          transactionData={filteredTransactions}
          loading={loading}
          error={error}
          currency={"gbp"}
          convertToGbp={true}
          deleteTransactionView={deleteTransactionView}
        />
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
        </div>
      )}

      <MobileNav />
    </div>
  );
};

export default Transactions;
