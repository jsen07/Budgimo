import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  getMonthsByUser,
  getAllCategoriesByUser,
} from "../../../utils/queries/queries";
import { addExpense } from "../../../utils/mutations/mutations";
import { formatDateToString } from "../../../utils/helperFunctions";
var cc = require("currency-codes");

const AddTransaction = ({ toggleAddTransactionMenu, user }) => {
  const currencyCodes = cc.codes();
  const [categories, setCategories] = useState([]);
  const [months, setMonths] = useState([]);
  const [isMonthSelected, setIsMonthSelected] = useState(false);
  const [selectedMonthId, setSelectedMonthId] = useState();
  const [currency, setCurrency] = useState("GBP");
  const [AddExpense] = useMutation(addExpense);

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    moneyOut: true,
    date: "",
    categoryId: "",
    userId: user ? user.data._id : "",
    monthId: "",
  });

  const { data: monthsData } = useQuery(getMonthsByUser, {
    skip: !user,
    variables: {
      userId: user ? user.data._id : "",
    },
  });

  const { data, loading } = useQuery(getAllCategoriesByUser, {
    variables: {
      userId: user.data._id,
    },
  });

  useEffect(() => {
    if (data) {
      setCategories(data.getAllCategoriesByUser);
    }
    if (monthsData) {
      setMonths(monthsData.getMonthsByUser);
    }
  }, [data, monthsData]);

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMonthSelect = (e) => {
    const selectedMonth = e.target.value;
    const selectedMonthName = months.find(
      (month) => month.id === selectedMonth
    );
    const longDate = formatDateToString(selectedMonthName.month);
    const formattedMonth = getFormattedMonth(longDate);
    setSelectedMonthId(formattedMonth);

    setFormData((prev) => ({
      ...prev,
      monthId: selectedMonth,
    }));
    setIsMonthSelected(true);
  };

  const handleAmountBlur = () => {
    setFormData((prev) => ({
      ...prev,
      amount: parseFloat(prev.amount).toFixed(2),
    }));
  };

  const getFormattedMonth = (monthName) => {
    if (!monthName) return null;

    const [month, year] = monthName.split(" ");
    const monthIndex = new Date(`${month} 1, 2025`).getMonth();

    return `${year}-${(monthIndex + 1).toString().padStart(2, "0")}`;
  };

  const getMonthDateRange = (month) => {
    const [year, monthNumber] = month.split("-");
    const firstDay = new Date(year, monthNumber - 1, 1); // first day of the month
    const lastDay = new Date(year, monthNumber, 0); // last day of the month

    const today = new Date();
    const isCurrentMonth =
      today.getFullYear() === parseInt(year) &&
      today.getMonth() + 1 === parseInt(monthNumber);

    return {
      minDate: firstDay.toISOString().split("T")[0],
      maxDate: isCurrentMonth
        ? today.toISOString().split("T")[0]
        : lastDay.toISOString().split("T")[0],
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await AddExpense({
        variables: {
          name: formData.description,
          currency: currency,
          amount: formData.amount,
          moneyOut: formData.moneyOut,
          date: formData.date,
          categoryId: formData.categoryId,
          userId: user ? user.data._id : "",
          monthId: formData.monthId,
        },
      });

      if (data) {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items center">
      <div className="w-full flex items-end justify-end">
        <CloseRoundedIcon onClick={() => toggleAddTransactionMenu()} />
      </div>
      <div className="w-full flex flex-col my-2">
        <form
          className="flex flex-col gap-4 px-1 w-full"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-2 rounded"
            required
          />

          <div className="flex gap-4">
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

          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            onBlur={handleAmountBlur}
            placeholder="Amount"
            step="0.01"
            min="0"
            className="border p-2 rounded"
            required
          />

          <div className="flex gap-4">
            <label htmlFor="moneyOut">
              <input
                className="mx-2"
                type="radio"
                name="moneyOut"
                value={true}
                checked={formData.moneyOut === true}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    moneyOut: true,
                  }))
                }
              />
              Out
            </label>
            <label htmlFor="moneyOut-in">
              <input
                className="mx-2"
                type="radio"
                name="moneyOut-in"
                value={false}
                checked={formData.moneyOut === false}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    moneyOut: false,
                  }))
                }
              />
              In
            </label>
          </div>

          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            name="monthId"
            value={formData.monthId}
            onChange={handleMonthSelect}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Month</option>
            {months.map((month) => (
              <option key={month.id} value={month.id}>
                {formatDateToString(month.month)}{" "}
              </option>
            ))}
          </select>

          {isMonthSelected && (
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  date: e.target.value,
                }))
              }
              className="border p-2 rounded"
              min={getMonthDateRange(selectedMonthId).minDate}
              max={getMonthDateRange(selectedMonthId).maxDate}
            />
          )}

          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-teal-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={
              !formData.description ||
              !formData.amount ||
              !formData.date ||
              !formData.categoryId ||
              !formData.monthId ||
              loading
            }
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
