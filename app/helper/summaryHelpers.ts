export const defaultSummaryWithExpense = (amount: number) => ({
    income: { daily: 0, weekly: 0, monthly: 0, total: 0 },
    expense: { daily: amount, weekly: amount, monthly: amount, total: amount },
  });
  
  export const defaultSummaryWithIncome = (amount: number) => ({
    income: { daily: amount, weekly: amount, monthly: amount, total: amount },
    expense: { daily: 0, weekly: 0, monthly: 0, total: 0 },
  });
  
  export const updateSummary = (
    prev: any,
    amount: number,
    type: "income" | "expense"
  ) => ({
    ...prev,
    [type]: {
      daily: (prev[type].daily || 0) + amount,
      weekly: (prev[type].weekly || 0) + amount,
      monthly: (prev[type].monthly || 0) + amount,
      total: (prev[type].total || 0) + amount,
    },
  });
  