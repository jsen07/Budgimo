import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import auth from "../../../utils/auth/auth";
import { getAllExpensesByUser } from "../../../../src/utils/queries/queries";
import FastfoodRoundedIcon from "@mui/icons-material/FastfoodRounded";
import { getRandomColor } from "../../../utils/helperFunctions";
import clsx from "clsx";
import TransactionSkeleton from "../../Loaders/TransactionSkeleton";
import useDelayedLoading from "../../../hooks/DelayedLoading";

const TransactionList = ({ limit, getTransactionData }) => {
  const [user, setUser] = useState(null);

  // Fetch expenses when user is ready
  const { data, loading, error } = useQuery(getAllExpensesByUser, {
    skip: !user,
    variables: {
      userId: user ? user.data._id : "",
      limit: limit,
      orderBy: "date_DESC",
    },
  });

  useEffect(() => {
    setUser(auth.getProfile());
  }, []);

  useEffect(() => {
    if (data && getTransactionData) {
      getTransactionData(data.getAllExpensesByUser);
    }
  }, [data, getTransactionData]);

  const showLoading = useDelayedLoading(loading, 1000);
  return (
    <>
      {/* Loading and Error Handling */}
      {showLoading && (
        <>
          <TransactionSkeleton />
          <TransactionSkeleton />
          <TransactionSkeleton />
        </>
      )}
      {error && <p>Error loading transactions: {error.message}</p>}

      {data?.getAllExpensesByUser?.length > 0 ? (
        <div>
          {data.getAllExpensesByUser.map((expense) => {
            const randomColor = getRandomColor();
            // const date = formatDateShort(expense.date);

            return (
              <div
                key={expense.id}
                className={clsx(
                  "flex flex-row justify-between items-center border rounded-lg p-3 mb-2",
                  `border-${randomColor}`
                )}
              >
                <div className="flex flex-row items-center justify-center">
                  <FastfoodRoundedIcon
                    className={clsx(`text-${randomColor}`)}
                  />
                  <h1 className="font-semibold ml-2">{expense.name}</h1>
                  {/* <h1>{date}</h1> */}
                </div>
                <div className="flex flex-col">
                  <p className="font-thin text-sm text-neutral-500">
                    {expense.category.name}
                  </p>
                  <p className="font-semibold text-red-600">
                    - {expense.amount}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        !loading && <p className="text-gray-500 mt-4">No transactions found.</p>
      )}
    </>
  );
};

export default TransactionList;
