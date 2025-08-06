import React from "react";
import WarningIcon from "@mui/icons-material/Warning";
import { useDispatch, useSelector } from "react-redux";
import { deleteExpenseMonth } from "../../store/monthSlice";
import { deleteTransaction } from "../../store/expenseSlice";
import { deleteExpense } from "../../utils/mutations/mutations";
import { useMutation } from "@apollo/client";

const DeleteExpense = ({ name, setDeleteEnabled, id }) => {
  const dispatch = useDispatch();
  const [removeExpense, { loading }] = useMutation(deleteExpense);

  const deleteSelectedExpense = async (id) => {
    try {
      const { data } = await removeExpense({
        variables: {
          id: id,
        },
      });

      if (data?.deleteExpense) {
        dispatch(deleteExpenseMonth(id));
        dispatch(deleteTransaction({ expenseId: id }));
        setDeleteEnabled(false);
      }
    } catch (err) {
      console.error("addMonthError:", err);
    }
  };
  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-neutral-500 bg-opacity-50 flex items-center justify-center px-4">
      <div className="flex flex-col items-center justify-between w-full border-2 bg-white p-6 rounded-xl shadow-lg text-4xl">
        <WarningIcon fontSize="inherit" className="text-red-600 mb-4" />
        <h1 className="text-base font-bold text-center mb-4">Delete Expense</h1>
        <h2 className="text-sm font-medium text-center mb-6">
          You are about to permanently delete "{name || `unidentified`}" from
          your expense. Would you like to continue?
        </h2>
        <div className="flex gap-4 text-sm w-full items-center justify-between px-4">
          <button
            className="bg-red-600 grow text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
            onClick={() => {
              deleteSelectedExpense(id);
            }}
          >
            Yes
          </button>
          <button
            className="bg-gray-300 grow text-black px-4 py-2 rounded-full hover:bg-gray-400 transition"
            onClick={() => {
              setDeleteEnabled(false);
            }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteExpense;
