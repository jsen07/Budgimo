export const getRandomColor = () => {
  const colors = [
    "orange-500",
    "teal-500",
    "violet-500",
    "emerald-500",
    "rose-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const formatDateShort = (timestamp) => {
  const date = new Date(Number(timestamp));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const formatDateTransactions = (date) => {
  const parsedDate = new Date(date);

  if (isNaN(parsedDate)) {
    return "Not valid date";
  }

  // Format the date as "day month yEAR"
  return parsedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const getDateDifferenceInMilliseconds = (dateStr) => {
  const currentDate = new Date();
  const transactionDate = new Date(dateStr);
  return Math.abs(currentDate - transactionDate);
};

// Function to group transactions by formatted date
export const groupTransactionsByDate = (transactions, formatDateFunction) => {
  return transactions.reduce((acc, transaction) => {
    const formattedDate = formatDateFunction(transaction.date);
    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }
    acc[formattedDate].push(transaction);
    return acc;
  }, {});
};

export const sortTransactionsByDate = (transactions) => {
  const transactionsCopy = [...transactions];

  return transactionsCopy.sort(
    (a, b) =>
      getDateDifferenceInMilliseconds(a.date) -
      getDateDifferenceInMilliseconds(b.date)
  );
};
export const calculatePercentage = (budget, spent) => {
  const percentage_spent = (spent / budget) * 100;
  return percentage_spent.toFixed(2);
};

export const formatDateToString = (dateString) => {
  const [month, year] = dateString.split("-");

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthName = monthNames[parseInt(month, 10) - 1];

  return `${monthName} ${year}`;
};
