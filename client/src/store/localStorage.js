export const loadState = () => {
  try {
    const serializedStateMonth = localStorage.getItem("monthSlice");
    const serializedStateExpense = localStorage.getItem("expenseSlice");
    if (serializedStateMonth === null || serializedStateExpense === null) {
      return undefined;
    }
    return {
      month: JSON.parse(serializedStateMonth),
      expense: JSON.parse(serializedStateExpense),
    };
  } catch (err) {
    console.error("Error loading state from localStorage:", err);
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedStateMonth = JSON.stringify(state.month);
    const serializedStateExpense = JSON.stringify(state.expense);
    localStorage.setItem("monthSlice", serializedStateMonth);
    localStorage.setItem("expenseSlice", serializedStateExpense);
  } catch (err) {
    console.error("Error saving state to localStorage:", err);
  }
};
