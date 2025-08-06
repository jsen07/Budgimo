import React, { useState } from "react";
import auth from "../../utils/auth/auth";
import { useNavigate, useLocation } from "react-router-dom";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import PaymentRoundedIcon from "@mui/icons-material/PaymentRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import Avatar from "@mui/material/Avatar";

const NavigationLinks = ({ firstName, LastName }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: DashboardRoundedIcon,
    },
    {
      label: "Transactions",
      path: "/transactions",
      icon: PaymentRoundedIcon,
    },
    {
      label: "Schedule",
      path: "/schedule",
      icon: CalendarTodayRoundedIcon,
    },
    // {
    //   label: "Analytics",
    //   path: "/analytics",
    //   icon: TimelineRoundedIcon,
    // },
  ];
  return (
    <div className="hidden w-80 text-white lg:flex h-full flex-col justify-between pb-8 px-4 lg:text-sm relative">
      <div className="hidden 2xl:flex w-full h-[80px] sticky top-0 flex-row py-4 justify-between items-center">
        <h1 className="font-hero font-semibold text-2xl text-teal-600">
          Budgimo
        </h1>
        <Avatar>{firstName + LastName}</Avatar>
      </div>
      <div className="h-full flex flex-col fixed left-0 w-80 px-4 top-[80px] lg:pb-[100px] justify-between bg-neutral-800">
        <ul className="w-full gap-6 flex flex-col mt-4 lg:text-sm font-semibold py-6">
          {menuItems.map(({ label, path, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <li
                key={label}
                onClick={() => navigate(path)}
                className={`flex items-center justify-between gap-4 py-2 px-2 rounded-lg cursor-pointer hover:bg-neutral-700 ${
                  isActive ? "text-teal-500" : ""
                }`}
              >
                {label}
                <Icon
                  fontSize="small"
                  className={isActive ? "text-teal-500" : "text-neutral-500"}
                />
              </li>
            );
          })}
        </ul>
        <button
          onClick={() => auth.logout()}
          className="flex gap-1 items-center text-sm font-semibold mt-8"
        >
          <ExitToAppRoundedIcon fontSize="medium" className="text-white" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default NavigationLinks;
