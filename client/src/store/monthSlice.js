// monthSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  months: [],
  activeMonths: [], // <-- add this line
};

const monthSlice = createSlice({
  name: "month",
  initialState,
  reducers: {
    addMonthLocal: (state, action) => {
      const existing = state.months.find((m) => m.id === action.payload.id);
      if (!existing) {
        state.months.push(action.payload);
      } else {
        const index = state.months.findIndex((m) => m.id === action.payload.id);
        state.months[index] = action.payload;
      }

      const isAlreadyActive = state.activeMonths.some(
        (m) => m.id === action.payload.id
      );

      if (!isAlreadyActive) {
        state.activeMonths.push({
          id: action.payload.id,
          month: action.payload.month,
        });
      }
    },

    setActiveMonths: (state, action) => {
      state.activeMonths = action.payload;
    },

    addExpenseMonth: (state, action) => {
      const existing = state.months.find(
        (m) => m.id === action.payload.monthId
      );
      console.log(action.payload.monthId);

      if (existing) {
        const index = state.months.findIndex(
          (m) => m.id === action.payload.monthId
        );
        state.months[index].expenses.push(action.payload);

        const expense = action.payload.amount * action.payload.rate;

        action.payload.moneyOut
          ? (state.months[index].balance =
              state.months[index].balance - expense)
          : (state.months[index].balance =
              state.months[index].balance + expense);
      }
    },
    deleteExpenseMonth: (state, action) => {
      const expenseId = action.payload;

      const month = state.months.find((m) =>
        m.expenses.some((exp) => exp.id === expenseId)
      );

      if (month) {
        const expense = month.expenses.find((exp) => exp.id === expenseId);

        if (expense) {
          const expenseValue = expense.amount * expense.rate;

          month.expenses = month.expenses.filter((exp) => exp.id !== expenseId);

          expense.moneyOut
            ? (month.balance += expenseValue)
            : (month.balance -= expenseValue);
        }
      }
    },
  },
});

export const {
  addMonthLocal,
  setActiveMonths,
  addExpenseMonth,
  deleteExpenseMonth,
} = monthSlice.actions;
export default monthSlice.reducer;
