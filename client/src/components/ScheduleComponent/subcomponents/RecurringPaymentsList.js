import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { getAllRecurringPayment } from "../../../utils/queries/queries";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const RecurringPaymentsList = ({ user, month }) => {
  const [recurringPayments, setRecurringPayments] = useState([]);
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
          const [currentMonth] = month.split("-");
          const [paymentMonth] = payment.date.split("-");

          return paymentMonth === currentMonth;
        });
        setRecurringPayments(filtered ? filtered : []);
      } else {
        setRecurringPayments(payments);
      }
    }
  }, [data, month]);
  return (
    <>
      {!month &&
        recurringPayments.length > 0 &&
        recurringPayments.map((payment) => (
          <div
            key={payment.id}
            className="flex flex-row justify-between items-center border rounded-lg p-3 mb-2 bg-teal-400 w-full"
          >
            <h1 className="font-semibold">{payment.name}</h1>
            <div className="flex flex-col">
              <p className="font-semibold"> - £{payment.amount}</p>
            </div>
          </div>
        ))}

      {month && recurringPayments.length > 0 && (
        <>
          <div className="flex flex-row justify-between w-full my-2">
            <h1 className="font-semibold">Upcoming payments</h1>
            <h1 className="font-light tracking-tighter text-sm text-gray-600 flex items-center gap-1">
              See all <ArrowRightIcon className="text-black w-4 h-4" />
            </h1>
          </div>
          {recurringPayments.map((payment) => (
            <div
              key={payment.id}
              className="flex flex-row justify-between items-center border rounded-lg p-3 mb-2 bg-teal-400"
            >
              <h1 className="font-semibold">{payment.name}</h1>
              <div className="flex flex-col">
                <p className="font-semibold"> - £{payment.amount}</p>
              </div>
            </div>
          ))}
        </>
      )}
      {recurringPayments.length < 0 && (
        <h1 className="font-semibold"> No recurring payments. </h1>
      )}
    </>
  );
};
export default RecurringPaymentsList;
