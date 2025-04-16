import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileNav from "../NavigationComponent/MobileNav";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import CalendarViewDayIcon from "@mui/icons-material/CalendarViewDay";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Schedule = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(new Date());
  const [payment, setPayment] = useState();
  const [calendarView, setCalendarView] = useState(false);

  const recurringPayments = [
    { date: "2025-04-14", title: "Netflix", amount: "19.99" },
    { date: "2025-04-18", title: "Spotify", amount: "14.99" },
  ];

  const handleDateChange = (date) => {
    setValue(date);
    const formatted = date.toISOString().split("T")[0];
    const foundEvent = recurringPayments.find((e) => e.date === formatted);
    setPayment(foundEvent || null);
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const formatted = date.toISOString().split("T")[0];
      const event = recurringPayments.find((e) => e.date === formatted);
      if (event) {
        return <span className="text-xs text-teal-600 mt-1">•</span>;
      }
    }
    return null;
  };

  return (
    <div className="flex flex-col font-sans pb-[100px]">
      <div className="sticky top-0 w-full flex flex-col pt-8 bg-white">
        <div className="flex flex-row justify-between items-center text-2xl px-2 relative">
          <ArrowBackIosRoundedIcon onClick={() => navigate("/dashboard")} />
          <h1 className="font-semibold tracking-wide absolute left-1/2 -translate-x-1/2">
            Schedule
          </h1>
          <button
            className="flex flex-row gap-2 text-teal-600 mr-2"
            onClick={() => setCalendarView(!calendarView)}
          >
            <CalendarViewDayIcon style={{ fontSize: "28px" }} />
          </button>
        </div>
      </div>

      {calendarView ? (
        <div className="w-full py-2 flex flex-col mt-4">
          <div className="w-full border-2 mb-4">
            <button
              className="border-2 p-2 rounded"
              onClick={() => {
                setCalendarView((prev) => !prev);
              }}
            >
              Overview
            </button>
          </div>
          <div className="w-full flex items-center justify-center">
            <Calendar
              className="react-calendar w-full max-w-none py-5 px-2"
              onChange={handleDateChange}
              value={value}
              tileContent={tileContent}
            />
          </div>
          {payment ? (
            <div className="p-4 text-center h-auto">
              <h2 className="text-lg font-semibold text-teal-700">
                Payment Details
              </h2>
              <p className="text-sm text-gray-700">{payment.title}</p>
              <p className="text-sm text-gray-700">{payment.amount}</p>
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-gray-400 italic">
              No payments on this day.
              <div className="mt-2">
                <button className="border-2 px-3 py-1 rounded">
                  Add recurring payment
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full flex flex-col mt-8 px-4 items-start">
          <h1 className="text-center text-xl text-gray-600">
            Monthly Payments
          </h1>

          <div className="flex flex-row justify-between mt-4 text-sm w-full">
            <button className="border-2 p-2 rounded">
              Set up monthly budget
            </button>
            <button
              className="border-2 p-2 rounded"
              onClick={() => {
                setCalendarView((prev) => !prev);
              }}
            >
              {" "}
              Calendar view
            </button>
          </div>
        </div>
      )}

      <MobileNav />
    </div>
  );
};

export default Schedule;
