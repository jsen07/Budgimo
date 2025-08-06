import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  transactions: [],
};

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    setTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    addTransaction: (state, action) => {
      state.transactions.push(action.payload);
    },
    deleteTransaction: (state, action) => {
      const existing = state.transactions.find(
        (expense) => expense.id === action.payload.expenseId
      );
      if (existing) {
        state.transactions = state.transactions.filter(
          (expense) => expense.id !== action.payload.expenseId
        );
      }
    },
    clearTransactions: (state) => {
      state.transactions = [];
    },
  },
});

export const {
  setTransactions,
  addTransaction,
  deleteTransaction,
  clearTransactions,
} = expenseSlice.actions;
export default expenseSlice.reducer;
