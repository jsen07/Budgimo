import { configureStore } from "@reduxjs/toolkit";
import monthReducer from "./monthSlice";
import expenseReducer from "./expenseSlice";
import { loadState, saveState } from "./localStorage";

const preloadedState = loadState(); // from localStorage

const store = configureStore({
  reducer: {
    month: monthReducer,
    expense: expenseReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveState({
    month: store.getState().month,
    expense: store.getState().expense,
  });
});

export default store;
