import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { getAllRecurringPayment } from "../../../utils/queries/queries";

const RecurringPaymentsList = ({ user }) => {
  const [recurringPayments, setRecurringPayments] = useState([]);
  const { data: recurringPaymentData, loading: recurringPaymentLoading } =
    useQuery(getAllRecurringPayment, {
      skip: !user,
      variables: {
        userId: user ? user._id : "",
      },
    });

  useEffect(() => {
    if (recurringPaymentData?.getAllRecurringPayment) {
      setRecurringPayments(recurringPaymentData.getAllRecurringPayment);
    }
  }, [recurringPaymentData]);
  return (
    <>
      {recurringPayments.length > 0 &&
        recurringPayments.map((payment) => {
          return (
            <div
              key={payment.id}
              className="flex flex-row justify-between items-center border rounded-lg p-3 mb-2 bg-teal-400"
            >
              <h1 className="font-semibold">{payment.name}</h1>
              <div className="flex flex-col">
                <p className="font-semibold"> - £{payment.amount}</p>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default RecurringPaymentsList;
