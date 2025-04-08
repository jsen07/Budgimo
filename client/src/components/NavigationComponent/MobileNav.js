import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import PaymentRoundedIcon from "@mui/icons-material/PaymentRounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import auth from "../../utils/auth/auth";

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 bg-white w-full h-[100px] flex flex-row items-center justify-evenly border pb-8 text-neutral-500 text-[10px] font-sans tracking-tighter text-center">
      <div className="flex flex-col items-center justify-center hover:scale-95 transition">
        <button onClick={() => navigate("/dashboard")}>
          <DashboardRoundedIcon
            fontSize="medium"
            className={
              location.pathname === "/dashboard"
                ? "text-teal-500"
                : "text-neutral-500"
            }
          />
          <p
            className={
              location.pathname === "/dashboard" ? "text-teal-500" : ""
            }
          >
            Dashboard
          </p>
        </button>
      </div>
      <div className="flex flex-col items-center justify-center hover:scale-95 transition">
        <button onClick={() => navigate("/transactions")}>
          <PaymentRoundedIcon
            fontSize="medium"
            className={
              location.pathname === "/transactions"
                ? "text-teal-500"
                : "text-neutral-500"
            }
          />
          <p
            className={
              location.pathname === "/transactions" ? "text-teal-500" : ""
            }
          >
            Transactions
          </p>
        </button>
      </div>
      <div className="flex flex-col items-center justify-center hover:scale-95 transition">
        <button onClick={() => navigate("/schedule")}>
          <CalendarTodayRoundedIcon
            fontSize="medium"
            className={
              location.pathname === "/schedule"
                ? "text-teal-500"
                : "text-neutral-500"
            }
          />
          <p
            className={location.pathname === "/schedule" ? "text-teal-500" : ""}
          >
            Schedule
          </p>
        </button>
      </div>
      <div className="flex flex-col items-center justify-center hover:scale-95 transition">
        <button onClick={() => navigate("/analytics")}>
          <TimelineRoundedIcon
            fontSize="medium"
            className={
              location.pathname === "/analytics"
                ? "text-teal-500"
                : "text-neutral-500"
            }
          />
          <p
            className={
              location.pathname === "/analytics" ? "text-teal-500" : ""
            }
          >
            Analytics
          </p>
        </button>
      </div>
      <div className="flex flex-col items-center justify-center hover:scale-95 transition">
        <button onClick={() => auth.logout()}>
          <ExitToAppRoundedIcon
            fontSize="medium"
            className="text-neutral-500"
          />
          <p>Logout</p>
        </button>
      </div>
    </div>
  );
};

export default MobileNav;
