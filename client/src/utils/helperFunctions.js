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

export const calculatePercentage = (budget, spent) => {
  const percentage_spent = (spent / budget) * 100;
  return percentage_spent;
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
