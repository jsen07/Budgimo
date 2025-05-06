import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import auth from "../../utils/auth/auth";
import MobileNav from "../NavigationComponent/MobileNav";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import CalendarViewDayIcon from "@mui/icons-material/CalendarViewDay";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useQuery } from "@apollo/client";
import { getAllRecurringPayment } from "../../utils/queries/queries";
import AddIcon from "@mui/icons-material/Add";
import AddMonthlyBudget from "../forms/AddMonthlyBudget";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import RecurringPaymentsList from "./subcomponents/RecurringPaymentsList";

const Schedule = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [value, setValue] = useState(new Date());
  const [payments, setPayments] = useState([]);
  const [calendarView, setCalendarView] = useState(false);
  const [recurringPayments, setRecurringPayments] = useState([]);
  const [closing, setClosing] = useState(false);
  const [addMonthToggle, setAddMonthToggle] = useState(false);

  const { data: recurringPaymentData } = useQuery(getAllRecurringPayment, {
    skip: !user,
    variables: {
      userId: user ? user._id : "",
    },
  });

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    const user = auth.getProfile();
    setUser(user?.data || "");
  }, []);

  useEffect(() => {
    if (recurringPaymentData?.getAllRecurringPayment) {
      setRecurringPayments(recurringPaymentData.getAllRecurringPayment);
    }
  }, [recurringPaymentData]);

  const handleDateChange = (date) => {
    setValue(date);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const dayOfWeek = weekdays[date.getDay()];
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

    const matched = recurringPayments.filter((e) => {
      if (e.frequence === "Weekly") {
        return weekdays.includes(e.date) && e.date === dayOfWeek;
      } else if (e.frequence === "Monthly") {
        let adjustedDay = parseInt(e.date, 10);
        if (adjustedDay > lastDayOfMonth) adjustedDay = lastDayOfMonth;
        return adjustedDay === day;
      } else if (e.frequence === "Annual") {
        const [mm, dd] = e.date.split("-").map(Number);
        return mm === month + 1 && dd === day;
      }
      return false;
    });

    setPayments(matched);
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const day = date.getDate();
      const dayOfWeek = weekdays[date.getDay()];
      const month = date.getMonth();
      const year = date.getFullYear();
      const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

      const eventsOnDay = recurringPayments.filter((e) => {
        if (e.frequence === "Weekly") {
          return weekdays.includes(e.date) && e.date === dayOfWeek;
        } else if (e.frequence === "Monthly") {
          let adjusted = parseInt(e.date, 10);
          if (adjusted > lastDayOfMonth) adjusted = lastDayOfMonth;
          return adjusted === day;
        } else if (e.frequence === "Annual") {
          const [mm, dd] = e.date.split("-").map(Number);
          return mm === month + 1 && dd === day;
        }
        return false;
      });

      if (eventsOnDay.length > 0) {
        return (
          <div className="flex justify-center mt-1">
            {eventsOnDay.map((_, i) => (
              <span key={i} className="text-xs text-teal-600 mx-[1px]">
                •
              </span>
            ))}
          </div>
        );
      }
    }

    return null;
  };

  const toggleAddMonthMenu = () => {
    if (addMonthToggle) {
      setClosing(true);
      setTimeout(() => {
        setAddMonthToggle(false);
        setClosing(false);
      }, 300);
    } else {
      setAddMonthToggle(true);
    }
  };

  return (
    <div className="flex flex-col font-sans h-screen pb-[100px]">
      <div className="sticky top-0 w-full flex flex-col py-8 bg-white z-50">
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
        <div className="w-full py-2 flex flex-col mt-2 h-full relative">
          <button
            className="border-2  ml-2 p-2 rounded-lg border-teal-200 text-white font-medium bg-teal-500 border-2 w-1/3 mx-1"
            onClick={() => setCalendarView((prev) => !prev)}
          >
            Overview
          </button>

          <div className="w-full flex items-center justify-center sticky top-[60px]">
            <Calendar
              className="react-calendar w-full max-w-none py-5 px-2"
              onChange={handleDateChange}
              value={value}
              tileContent={tileContent}
            />
          </div>

          {payments.length > 0 ? (
            <div className="p-4 text-center h-auto pb-[100px]">
              <h2 className="text-lg font-semibold text-teal-700">
                Payment Details
              </h2>
              {payments.map((payment, index) => (
                <div
                  key={index}
                  className="mb-2 flex flex-col items-start gap-2 mt-4 p-3 rounded-lg border border-teal-400"
                >
                  <p className="text-sm text-gray-700 font-bold">
                    {payment.frequence}
                  </p>
                  <div className="flex flex-row w-full justify-between">
                    <p className="text-sm text-gray-700 font-medium">
                      {payment.name}
                    </p>
                    <p className="text-sm text-gray-700">£{payment.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-gray-400 italic h-full flex items-center w-full">
              <div className="w-full h-full flex  flex-col justify-between">
                <p>No payments on this day.</p>
                <button className="p-3 rounded-md bg-blue-400 mt-2 text-black">
                  Add a recurring payment
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full flex flex-col px-4 items-start relative h-full">
          <div className="flex flex-row justify-between my-4 text-sm w-full">
            <button
              onClick={() => toggleAddMonthMenu()}
              className="py-2 px-3 rounded-lg flex items-center justify-center gap-1 bg-teal-400 border"
            >
              Add Budget <AddIcon />
            </button>
            <button
              className="border p-2 rounded rounded-lg bg-teal-300"
              onClick={() => setCalendarView((prev) => !prev)}
            >
              Calendar view
            </button>
          </div>

          {addMonthToggle && (
            <div
              className={`fixed bottom-0 pb-[100px] left-0  p-3 w-full border-t-lg rounded-xl bg-white border-2 ${
                closing ? "animate-slide-out-bottom" : "animate-slide-in-bottom"
              }`}
            >
              <button
                className="w-full flex justify-end"
                onClick={() => toggleAddMonthMenu()}
              >
                {" "}
                <CloseRoundedIcon />{" "}
              </button>
              <AddMonthlyBudget
                toggleAddMonthMenu={toggleAddMonthMenu}
                user={user}
              />
            </div>
          )}

          <h1 className="text-lg font-medium text-gray-600 mb-4 border-y-2 w-full py-2 px-1">
            Subscriptions
          </h1>
          <RecurringPaymentsList user={user} />
        </div>
      )}

      <MobileNav />
    </div>
  );
};

export default Schedule;
