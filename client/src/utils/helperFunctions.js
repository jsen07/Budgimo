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
  return percentage_spent.toFixed(0);
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

export const formatDateToDayMonth = (dateString) => {
  const [d, m] = dateString.split("-");
  const day = parseInt(d, 10);

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

  const month = monthNames[parseInt(m, 10) - 1];

  return `${day} ${month}`;
};

export const getDaysDifference = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [day, month] = dateStr.split("-").map(Number);
  const currentYear = today.getFullYear();
  const date = new Date(currentYear, month - 1, day);
  date.setHours(0, 0, 0, 0);

  const msInDay = 1000 * 60 * 60 * 24;
  // console.log(Math.abs(Math.round((date - today) / msInDay)));
  return Math.abs(Math.round((date - today) / msInDay));
};
