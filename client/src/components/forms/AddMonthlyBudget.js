import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMonthLocal, setActiveMonths } from "../../store/monthSlice";
import { useMutation } from "@apollo/client";
import { addMonth } from "../../utils/mutations/mutations";
var cc = require("currency-codes");

const AddMonthlyBudget = ({ user, toggleAddMonthMenu }) => {
  const dispatch = useDispatch();
  const activeMonths = useSelector((state) => state.month.activeMonths);
  const [addMonthlyBudget, { loading }] = useMutation(addMonth);
  const currencyCodes = cc.codes();
  const [month, setMonth] = useState("");
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("GBP");

  const handleMonthChange = (e) => {
    let date = e.target.value;
    const newDate = date.split("-").reverse().join("-");
    setMonth(newDate);
  };
  const handleBudgetChange = (e) => {
    const budget = parseInt(e.target.value).toFixed(2);
    setBudget(budget);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (month === "" || budget === "") {
      return;
    }
    try {
      const { data } = await addMonthlyBudget({
        variables: {
          month: month,
          currency: currency,
          budget: budget,
          userId: user ? user._id : "",
        },
      });

      if (data) {
        dispatch(addMonthLocal(data.addMonth));
        console.log("Active months after dispatch:", activeMonths);
        toggleAddMonthMenu();
      }
    } catch (err) {
      console.error("addMonthError:", err);
    }
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  return (
    <form className="bg-white w-full">
      {/* Month */}
      <div className="mb-4">
        <label htmlFor="month" className="block text-gray-700 font-medium mb-2">
          Month
        </label>
        <input
          type="month"
          id="month"
          name="month"
          onChange={handleMonthChange}
          className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
      </div>
      {/* Currency Code */}
      <div className="mb-4">
        <label
          htmlFor="currency"
          className="block text-gray-700 font-medium mb-2"
        >
          Currency
        </label>
        <select
          id="currency"
          name="currency"
          value={currency}
          onChange={handleCurrencyChange}
          className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
        >
          {currencyCodes.map((code) => (
            <option key={code} value={code} className="">
              {code}
            </option>
          ))}
        </select>
      </div>
      {/* Budget */}
      <div className="mb-4">
        <label
          htmlFor="budget"
          className="block text-gray-700 font-medium mb-2"
        >
          Budget
        </label>
        <input
          type="number"
          id="budget"
          name="budget"
          onChange={handleBudgetChange}
          placeholder="Enter budget amount"
          className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="w-full bg-teal-600 text-white py-3 mb-4 rounded-xl font-semibold hover:bg-teal-700 transition"
        onClick={handleSubmit}
      >
        Save
      </button>
    </form>
  );
};

export default AddMonthlyBudget;
