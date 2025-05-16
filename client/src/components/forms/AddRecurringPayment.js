import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { addRecurringPayment } from "../../utils/mutations/mutations";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { formatDateToDayMonth } from "../../utils/helperFunctions";

const AddRecurringPayment = ({
  user,
  selectedDay,
  selectedDate,
  value,
  toggleAddRecurringPaymentMenu,
}) => {
  const [addSubscription, { loading }] = useMutation(addRecurringPayment);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [frequence, setFrequence] = useState("Weekly");
  const [calendarDate, setCalendarDate] = useState(null);
  const [date, setDate] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");

  const handleAmountChange = (e) => {
    const formattedAmount = parseInt(e.target.value).toFixed(2);
    setAmount(formattedAmount);
  };

  const handleDateChange = (selectedDate) => {
    setCalendarDate(selectedDate);

    const day = String(selectedDate.getDate()).padStart(2, "0");
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    setDate(`${day}-${month}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !amount || !date || !frequence) return;
    console.log(name, amount, date, frequence);

    try {
      const { data } = await addSubscription({
        variables: {
          name,
          amount,
          date: frequence === "Weekly" ? dayOfWeek : date,
          frequence,
          userId: user ? user._id : "",
        },
      });

      if (data) {
        console.log("Payment added:", data);
        toggleAddRecurringPaymentMenu();
      }
    } catch (err) {
      console.error("addRecurringPaymentError:", err);
    }
  };

  return (
    <form
      className="bg-white grow flex flex-col mb-3 p-2"
      onSubmit={handleSubmit}
    >
      {/* Description */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Description
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter description"
          className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
      </div>

      {/* Amount */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Amount</label>
        <input
          type="number"
          onChange={handleAmountChange}
          placeholder="Enter amount"
          className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
      </div>

      {/* Frequency */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Period</label>
        <select
          value={frequence}
          onChange={(e) => setFrequence(e.target.value)}
          className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
        >
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="Annually">Annually</option>
        </select>

        {frequence === "Weekly" && (
          <div className="my-4">
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value="">{selectedDay || "Select a day"}</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>
        )}
        {/* Date Picker */}
        {(frequence === "Monthly" || frequence === "Annually") && (
          <>
            <label className="block text-gray-700 font-medium my-2">
              Pick a Date
            </label>
            <div className="h-[400px]">
              <Calendar
                onChange={handleDateChange}
                value={calendarDate || value}
                formatMonthYear={(locale, date) =>
                  date.toLocaleString(locale, { month: "long" })
                }
                prev2Label={null} // Removes the double-left arrow
                next2Label={null}
              />
            </div>
            {(date || selectedDate) && (
              <p className="text-sm text-gray-500">
                Selected:{" "}
                <strong>{formatDateToDayMonth(date || selectedDate)}</strong>
              </p>
            )}
          </>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!name || !amount || (!date && !dayOfWeek)}
        className="w-full  mt-auto bg-teal-600 text-white py-3 mb-4 rounded-xl font-semibold hover:bg-teal-700 transition"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
};

export default AddRecurringPayment;
