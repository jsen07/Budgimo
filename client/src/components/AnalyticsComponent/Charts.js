import * as React from "react";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import { BarChart, LineChart } from "@mui/x-charts";
import { useEffect, useState, useRef } from "react";
const getSymbolFromCurrency = require("currency-symbol-map");

export default function Charts({ monthData, currency }) {
  const [categoryExpenses, setCategoryExpenses] = useState([]);
  const [chartWidth, setChartWidth] = useState(0);
  const [chartIndex, setChartIndex] = useState(0);
  const [dailyTotals, setDailyTotals] = useState([]);
  const containerRef = useRef();

  useEffect(() => {
    if (monthData && Array.isArray(monthData)) {
      // console.log(monthData);
      const categoryTotals = monthData.reduce((acc, expense) => {
        const categoryName = expense.category?.name;
        if (!categoryName) return acc;

        const value = expense.rate * expense.amount;
        const amount = expense.moneyOut ? -value : +value;

        const category = acc.find((c) => c.name === categoryName);
        if (category) {
          category.totalAmount += amount;
        } else {
          acc.push({ name: categoryName, totalAmount: amount });
        }
        return acc;
      }, []);

      setCategoryExpenses(categoryTotals);
    }
  }, [monthData]);

  useEffect(() => {
    if (monthData && Array.isArray(monthData)) {
      const dailyTotalsMap = {};
      monthData.forEach((expense) => {
        const date = new Date(expense.date);
        const day = date.getDate();
        const value = expense.rate * expense.amount;
        const amount = expense.moneyOut ? -value.toFixed(2) : +value.toFixed(2);

        if (dailyTotalsMap[day]) {
          dailyTotalsMap[day] += amount;
        } else {
          dailyTotalsMap[day] = amount;
        }
      });
      const maxDay = Math.max(
        ...monthData.map((expense) => new Date(expense.date).getDate())
      );

      const dailyTotals = Array.from({ length: maxDay }, (x, index) => {
        const day = index + 1;
        return {
          date: day,
          totalAmount: dailyTotalsMap[day] || 0,
        };
      });
      setDailyTotals(dailyTotals);
    }
  }, [monthData]);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        // console.log(containerRef.current.offsetWidth);
        setChartWidth(containerRef.current.offsetWidth - 24);
      }
    };
    updateWidth();

    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const barChart = () => (
    <BarChart
      height={300}
      width={chartWidth}
      series={[
        {
          data: categoryExpenses.map((c) => c.totalAmount),
          label: "Total",
          color: "url(#Gradient)",
          valueFormatter: (value) => {
            const formattedValue = Math.abs(value).toFixed(2);
            const symbol = getSymbolFromCurrency(currency) || "";
            return value < 0
              ? `-${symbol}${formattedValue}`
              : `${symbol}${formattedValue}`;
          },
        },
      ]}
      xAxis={[
        {
          data: categoryExpenses.map((c) => c.name),
          label: "Category",
          labelStyle: { fontSize: 12, fontWeight: 600 },
          tickLabelStyle: { fontSize: 10 },
        },
      ]}
      yAxis={[
        {
          labelStyle: { fontSize: 12, fontWeight: 600 },
          tickLabelStyle: { fontSize: 10 },
        },
      ]}
      grid={{ horizontal: true }}
      margin={{ top: 0, bottom: 0, left: -15, right: 0 }}
      sx={{
        ".MuiChartsAxis-tickLabel": { fontWeight: "500" },
        ".MuiChartsAxis-label": { fill: "#444" },
        ".MuiBarElement-root": {
          rx: 8,
        },
      }}
    >
      {" "}
      <linearGradient id="Gradient" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0" stopColor="#14b8a6" />
        <stop offset="1" stopColor="#ccfbf1" />
      </linearGradient>
      <pattern
        id="Pattern"
        patternUnits="userSpaceOnUse"
        width="20"
        height="40"
        patternTransform="scale(0.5)"
      ></pattern>
    </BarChart>
  );

  const lineChart = () => (
    <LineChart
      height={300}
      width={chartWidth}
      xAxis={[
        {
          data: categoryExpenses.map((c) => c.name),
          scaleType: "point",
          labelStyle: { fontSize: 12, fontWeight: 600 },
          tickLabelStyle: { fontSize: 10 },
        },
      ]}
      series={[
        {
          data: categoryExpenses.map((c) => c.totalAmount),
          label: "Total",
          color: "#0d9488",
          valueFormatter: (value) => {
            const formatted = Math.abs(value).toFixed(2);
            const symbol = getSymbolFromCurrency(currency) || "";
            return value < 0
              ? `-${symbol}${formatted}`
              : `${symbol}${formatted}`;
          },
        },
      ]}
      yAxis={[
        {
          // label: `Total (${getSymbolFromCurrency(currency) || currency})`,
          labelStyle: { fontSize: 12, fontWeight: 600 },
          tickLabelStyle: { fontSize: 10 },
        },
      ]}
      margin={{ top: 0, bottom: 0, left: -15, right: 0 }}
      grid={{ horizontal: true }}
    />
  );

  const dailyLineChart = () => (
    <LineChart
      height={300}
      width={chartWidth}
      xAxis={[
        {
          data: dailyTotals.map((d) => d.date),
          label: "Day",
          labelStyle: { fontSize: 12, fontWeight: 600 },
          tickLabelStyle: { fontSize: 10 },
        },
      ]}
      series={[
        {
          data: dailyTotals.map((d) => d.totalAmount),
          label: "Daily Total",
          color: "#0d9488",
          valueFormatter: (value) => {
            const formatted = Math.abs(value).toFixed(2);
            const symbol = getSymbolFromCurrency(currency) || "";
            return value < 0
              ? `-${symbol}${formatted}`
              : `${symbol}${formatted}`;
          },
        },
      ]}
      yAxis={[
        {
          labelStyle: { fontSize: 12, fontWeight: 600 },
          tickLabelStyle: { fontSize: 10 },
        },
      ]}
      margin={{ top: 0, bottom: 0, left: -15, right: 0 }}
      grid={{ horizontal: true }}
    />
  );
  const chartComponents = [barChart, lineChart, dailyLineChart];

  return (
    <>
      {monthData?.length > 0 && (
        <>
          <div className="w-full flex flex-row justify-between items-center mb-6 text-base font-semibold lg:font-normal lg:text-xl">
            <h2 className="font-sans">
              {chartIndex === 0 && "Total Expenses per Category"}
              {chartIndex === 1 && "Total Expenses per Category"}
              {chartIndex === 2 && "Daily Expense Totals"}
            </h2>
            <select
              className="bg-white border rounded-md p-2 font-thin text-sm"
              value={chartIndex}
              onChange={(e) => setChartIndex(Number(e.target.value))}
            >
              <option value={0}>Bar Chart - Category Totals</option>
              <option value={1}>Line Chart - Category Totals</option>
              <option value={2}>Line Chart - Daily Totals</option>
            </select>
          </div>
          <div
            ref={containerRef}
            className="w-full z-0 text-black font-medium text-sm text-center bg-white  border border-neutral-300 my-6 py-6 flex flex-col items-center justify-center lg:my-0 lg:max-w-[1100px]"
          >
            {" "}
            {chartComponents[chartIndex]()}
          </div>
        </>
      )}
    </>
  );
}
