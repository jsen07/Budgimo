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
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AddMonthlyBudget from "../forms/AddMonthlyBudget";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import RecurringPaymentsList from "./subcomponents/RecurringPaymentsList";
import AddRecurringPayment from "../forms/AddRecurringPayment";
import { formatDateToDayMonth } from "../../utils/helperFunctions";

const Schedule = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [value, setValue] = useState(new Date());
  const [payments, setPayments] = useState([]);
  const [calendarView, setCalendarView] = useState(false);
  const [recurringPayments, setRecurringPayments] = useState([]);
  const [closing, setClosing] = useState(false);
  const [addMonthToggle, setAddMonthToggle] = useState(false);
  const [addRecurringPaymentToggle, setAddRecurringPaymentToggle] =
    useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const { data: recurringPaymentData, loading } = useQuery(
    getAllRecurringPayment,
    {
      skip: !user,
      variables: {
        userId: user ? user._id : "",
      },
    }
  );

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

    const selectedDay = String(day).padStart(2, "0");
    const selectedMonth = String(month + 1).padStart(2, "0");
    setSelectedDate(`${selectedDay}-${selectedMonth}`);

    setSelectedDay(dayOfWeek);

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

  const toggleAddRecurringPaymentMenu = () => {
    if (addRecurringPaymentToggle) {
      setClosing(true);
      setTimeout(() => {
        setAddRecurringPaymentToggle(false);
        setClosing(false);
      }, 300);
    } else {
      setAddRecurringPaymentToggle(true);
    }
  };

  return (
    <>
      <div className="flex w-full flex-col px-2 font-sans h-screen pb-[100px] lg:pb-0 lg:px-4">
        {!addRecurringPaymentToggle && (
          <>
            <div className="sticky top-0 px-2 w-full flex flex-col py-8 bg-white z-50">
              <div className="flex flex-row justify-between items-center text-3xl px-2 relative">
                <ArrowBackIosRoundedIcon
                  onClick={() => navigate("/dashboard")}
                />
                <h1 className="font-semibold text-2xl tracking-wide absolute left-1/2 -translate-x-1/2">
                  Schedule
                </h1>
                {/* <CalendarViewDayIcon
                  className="text-teal-600 mr-2"
                  fontSize="inherit"
                /> */}
              </div>
            </div>

            {calendarView ? (
              <div className="w-full py-2 flex flex-col mt-2 h-full relative">
                <button
                  className="py-2 px-3 rounded-lg flex items-center justify-center bg-teal-400 font-semibold shadow-md w-1/3 ml-4 text-sm"
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
                    <h2 className="text-lg font-semibold text-teal-700 mb-2">
                      Payment Details
                    </h2>
                    {payments.map((payment, index) => (
                      <div
                        key={payment.id}
                        className="flex flex-row justify-between items-center shadow-xl border rounded-lg py-3 px-4 mb-2 bg-neutral-800"
                      >
                        <h1 className="font-semibold text-teal-500">
                          {payment.name}
                        </h1>
                        <div className="flex flex-col text-right">
                          <h1 className="font-semibold text-xs text-blue-400">
                            {formatDateToDayMonth(payment.date)}
                          </h1>
                          <p className="font-semibold text-white">
                            {" "}
                            - £{payment.amount}
                          </p>
                        </div>
                      </div>
                    ))}
                    <button
                      className="p-3 rounded-md bg-teal-500 hover:bg-teal-600 transition mt-2 text-black font-semibold text-white shadow w-full text-sm mb-4"
                      onClick={toggleAddRecurringPaymentMenu}
                    >
                      Add a recurring payment
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-400 italic h-full flex items-center w-full">
                    <div className="w-full h-full flex flex-col justify-between">
                      <p>No payments on this day.</p>
                      <button
                        className="p-3 rounded-md bg-teal-500 hover:bg-teal-600 transition mt-2 text-black font-semibold text-white shadow"
                        onClick={toggleAddRecurringPaymentMenu}
                      >
                        Add a recurring payment
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full flex flex-col px-2 items-start relative h-full">
                <div className="flex flex-row justify-between my-4 text-sm w-full font-semibold">
                  <button
                    onClick={toggleAddMonthMenu}
                    className="px-4 py-2 bg-teal-500 text-white rounded-lg shadow hover:bg-teal-600 transition flex items-center gap-1 border"
                  >
                    <AddIcon fontSize="inherit" /> Add Budget
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-100 text-black rounded-lg shadow hover:bg-gray-200 transition flex items-center gap-1"
                    onClick={() => setCalendarView((prev) => !prev)}
                  >
                    Calendar{" "}
                    <CalendarTodayIcon style={{ fontSize: "0.875rem" }} />
                  </button>
                </div>

                {addMonthToggle && (
                  <div
                    className={`fixed bottom-0 pb-[100px] left-0 p-3 w-full rounded-xl bg-white border-2 ${
                      closing
                        ? "animate-slide-out-bottom"
                        : "animate-slide-in-bottom"
                    }`}
                  >
                    <button
                      className="w-full flex justify-end"
                      onClick={toggleAddMonthMenu}
                    >
                      <CloseRoundedIcon />
                    </button>
                    <AddMonthlyBudget
                      toggleAddMonthMenu={toggleAddMonthMenu}
                      user={user}
                    />
                  </div>
                )}

                <h1 className="text-lg font-medium text-black mb-8 border-b-2 w-full py-2 px-1">
                  Subscriptions
                </h1>
                <RecurringPaymentsList user={user} filter={true} />

                {!loading &&
                  recurringPaymentData &&
                  recurringPayments &&
                  recurringPayments.length === 0 && (
                    <div className="w-full h-full text-center text-gray-500">
                      <span> You currently have no subscriptions.</span>
                    </div>
                  )}
              </div>
            )}
          </>
        )}

        {addRecurringPaymentToggle && (
          <div
            className={`fixed bottom-0 left-0 px-3 w-full h-full flex flex-col ${
              closing ? "animate-slide-out-bottom" : "animate-slide-in-bottom"
            }`}
          >
            <button
              className="w-full flex justify-end mt-2"
              onClick={toggleAddRecurringPaymentMenu}
            >
              <CloseRoundedIcon />
            </button>
            <AddRecurringPayment
              user={user}
              selectedDay={selectedDay}
              selectedDate={selectedDate}
              value={value}
              toggleAddRecurringPaymentMenu={toggleAddRecurringPaymentMenu}
            />
          </div>
        )}
      </div>

      {/* <MobileNav /> */}
    </>
  );
};

export default Schedule;
