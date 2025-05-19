import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { getAllRecurringPayment } from "../../../utils/queries/queries";

import {
  formatDateToDayMonth,
  getDaysDifference,
} from "../../../utils/helperFunctions";

const RecurringPaymentsList = ({ user, month, filter }) => {
  const [recurringPayments, setRecurringPayments] = useState([]);
  const { data, loading: recurringPaymentLoading } = useQuery(
    getAllRecurringPayment,
    {
      skip: !user,
      variables: { userId: user?._id || "" },
    }
  );

  const sortTransactionsClosestToday = (list) => {
    return [...list].sort(
      (a, b) => getDaysDifference(a.date) - getDaysDifference(b.date)
    );
  };

  useEffect(() => {
    if (data?.getAllRecurringPayment) {
      const payments = data.getAllRecurringPayment;

      if (month) {
        const [currentMonth] = month.split("-");
        const filtered = payments.filter((payment) => {
          const [, paymentMonth] = payment.date.split("-");
          return paymentMonth === currentMonth;
        });
        setRecurringPayments(
          filtered ? sortTransactionsClosestToday(filtered) : []
        );
      } else {
        setRecurringPayments(sortTransactionsClosestToday(payments));
      }
    }
  }, [data, month]);

  const groupedPaymentsByFrequence = useMemo(() => {
    if (!recurringPayments || recurringPayments.length === 0) return null;

    const grouped = recurringPayments.reduce((acc, payment) => {
      const key = payment.frequence;
      if (!acc[key]) acc[key] = [];
      acc[key].push(payment);
      return acc;
    }, {});

    Object.keys(grouped).forEach((key) => {
      grouped[key] = sortTransactionsClosestToday(grouped[key]);
    });

    return Object.entries(grouped).map(([frequence, payments]) => (
      <div key={frequence} className="mb-4 w-full">
        <h2 className="text-md font-semibold tracking-tighter mb-2">
          {frequence}
        </h2>
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="flex flex-row justify-between items-center shadow-xl border rounded-lg py-3 px-4 mb-2 bg-neutral-800"
          >
            <h1 className="font-semibold text-teal-500">{payment.name}</h1>
            <div className="flex flex-col text-right">
              <h1 className="font-semibold text-xs text-blue-400">
                {formatDateToDayMonth(payment.date)}
              </h1>
              <p className="font-semibold text-white"> - £{payment.amount}</p>
            </div>
          </div>
        ))}
      </div>
    ));
  }, [recurringPayments]);

  return (
    <>
      {!month && filter && groupedPaymentsByFrequence}

      {month && !filter && recurringPayments.length > 0 && (
        <>
          <div className="flex flex-row w-full my-2">
            <h1 className="font-semibold tracking-tighter">
              Recurring Payments
            </h1>
          </div>
          {recurringPayments.map((payment) => (
            <div
              key={payment.id}
              className="flex flex-row justify-between items-center shadow-xl border rounded-lg py-3 px-4 mb-2 bg-neutral-800"
            >
              <div className="flex flex-col">
                <h1 className="font-semibold text-teal-500">{payment.name}</h1>
                <h1 className="font-semibold text-xs text-gray-300">
                  {payment.frequence}
                </h1>
              </div>
              <div className="flex flex-col">
                <h1 className="font-semibold text-xs text-blue-400 text-right">
                  {formatDateToDayMonth(payment.date)}
                </h1>
                <p className="font-semibold text-white"> - £{payment.amount}</p>
              </div>
            </div>
          ))}
        </>
      )}

      {!recurringPaymentLoading && data && recurringPayments.length === 0 && (
        <h1 className="font-semibold">No recurring payments.</h1>
      )}
    </>
  );
};

export default RecurringPaymentsList;
