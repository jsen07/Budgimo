const getSymbolFromCurrency = require("currency-symbol-map");
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

function capitalizeEachWord(text) {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
export const getTotalSpendings = (month) => {
  if (month.expenses && month.expenses.length > 0) {
    const total = month.expenses.reduce((acc, expense) => {
      const amount = expense.amount || 0;
      const rate = expense.rate;
      const converted = amount * rate;

      return expense.moneyOut ? acc + converted : acc;
    }, 0);
    return total;
  } else {
    return 0;
  }
};

export const getHighestExpense = (month) => {
  if (month.expenses && month.expenses.length > 0) {
    const moneyOutExpenses = month.expenses.filter((e) => e.moneyOut);

    if (moneyOutExpenses.length === 0) return null;

    const highest = moneyOutExpenses.reduce((highest, expense) => {
      const currentConverted =
        parseFloat(expense.amount) * parseFloat(expense.rate || 1);
      const highestConverted =
        parseFloat(highest.amount) * parseFloat(highest.rate || 1);

      return currentConverted > highestConverted ? expense : highest;
    });

    return {
      ...highest,
      convertedAmount:
        parseFloat(highest.amount) * parseFloat(highest.rate || 1),
    };
  }
};
export const getTotalEarnings = (month) => {
  if (month.expenses && month.expenses.length > 0) {
    const total = month.expenses.reduce((acc, expense) => {
      const amount = parseFloat(expense.amount) || 0;
      const rate = expense.rate;
      const converted = amount * rate;

      return !expense.moneyOut ? acc + converted : acc;
    }, 0);
    return total;
  } else {
    return 0;
  }
};

export const getTotalExpenseCategory = (month) => {
  const totals = {};

  month.expenses.forEach((expense) => {
    const category = expense.category?.name;
    const rate = parseFloat(expense.rate) || 1;
    const amount = parseFloat(expense.amount) || 0;
    const adjustedAmount = amount * rate;

    if (!totals[category]) {
      totals[category] = {
        income: 0,
        expense: 0,
      };
    }

    expense.moneyOut
      ? (totals[category].expense += adjustedAmount)
      : (totals[category].income += adjustedAmount);
  });

  return Object.entries(totals).map(([category, { income, expense }]) => {
    const symbol = getSymbolFromCurrency(month?.currency);
    const net = income - expense;

    const formatAmount = (amount) => {
      const sign = amount < 0 ? "-" : "";
      return `${sign} ${symbol}${Math.abs(amount).toFixed(2)}`;
    };

    return {
      category,
      income: formatAmount(income),
      expense: formatAmount(expense),
      net: formatAmount(net),
    };
  });
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
