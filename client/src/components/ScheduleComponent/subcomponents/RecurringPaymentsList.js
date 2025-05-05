import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { getAllRecurringPayment } from "../../../utils/queries/queries";

const RecurringPaymentsList = ({ user, month }) => {
  const [recurringPayments, setRecurringPayments] = useState([]);
  const [filteredMonths, setFilteredMonths] = useState([]);
  const { data, loading: recurringPaymentLoading } = useQuery(
    getAllRecurringPayment,
    {
      skip: !user,
      variables: {
        userId: user ? user._id : "",
      },
    }
  );

  useEffect(() => {
    if (data?.getAllRecurringPayment) {
      const payments = data.getAllRecurringPayment;

      if (month) {
        const filtered = payments.filter((payment) => {
          const [currentMonth, d] = month.split("-");
          const [paymentMonth, y] = payment.date.split("-");

          return paymentMonth === currentMonth;
        });
        setRecurringPayments(filtered);
      } else {
        setRecurringPayments(payments);
      }
    }
  }, [data, month]);
  return (
    <>
      {recurringPayments.length > 0 && !month
        ? recurringPayments.map((payment) => {
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
          })
        : recurringPayments.map((payment) => {
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
