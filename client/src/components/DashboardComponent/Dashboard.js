import React, { useEffect, useState } from "react";
import auth from "../../utils/auth/auth";
import { useQuery } from "@apollo/client";
import MobileNav from "../NavigationComponent/MobileNav";
import Avatar from "@mui/material/Avatar";
import { getClosestMonth } from "../../utils/queries/queries";
import FsLoading from "../Loaders/FsLoading";
import MonthSummary from "../MonthSummaryComponent/MonthSummary";

const Dashboard = () => {
  const [firstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [user, setUser] = useState(null);
  const [monthQuery, setMonthQuery] = useState(); // month id
  const [childLoading, setChildLoading] = useState(false);
  const { data, loading } = useQuery(getClosestMonth, {
    skip: !user,
    variables: {
      userId: user ? user._id : "",
    },
  });

  useEffect(() => {
    if (data && data.getClosestMonth !== null) {
      setMonthQuery(data.getClosestMonth.id);
    }
  }, [data]);

  useEffect(() => {
    const user = auth.getProfile();
    setUser(user?.data || "");
    setFirstName(user.data.first_name.charAt(0).toUpperCase());

    setLastName(user.data.last_name.charAt(0).toUpperCase());
  }, []);

  const fetchMonthQuery = (query) => {
    setMonthQuery(query);
  };

  // if (loading || childLoading) return <FsLoading />;
  return (
    <div className="">
      <div className="w-full h-auto sticky top-0  bg-white flex flex-row py-4 px-6 justify-between items-center z-10">
        <h1 className="font-hero font-semibold text-2xl text-teal-600">
          Budgimo
        </h1>
        <Avatar>{firstName + LastName}</Avatar>
      </div>

      {/* Content */}
      {loading || childLoading || !user || !data ? (
        <FsLoading />
      ) : monthQuery ? (
        <MonthSummary
          monthQuery={monthQuery}
          fetchMonthQuery={fetchMonthQuery}
          user={user}
          setParentLoading={setChildLoading}
        />
      ) : (
        <div className="text-center text-gray-500 mt-4">
          No monthly data available.
        </div>
      )}

      <MobileNav />
    </div>
  );
};

export default Dashboard;
