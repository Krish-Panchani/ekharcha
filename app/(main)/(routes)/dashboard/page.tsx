"use client";
import React, { useState, useEffect } from "react";
import { useSummary } from "@/app/hooks/useSummary";
import ExpenseDrawer from "./expence-drawer";
import IncomeDrawer from "./income-drawer";
import { Summary } from "@/app/types/types";

export default function DashboardPage() {
  const { summary, loading, error, fetchSummary } = useSummary();
  const [localSummary, setLocalSummary] = useState<Summary | null>(summary);

  useEffect(() => {
    setLocalSummary(summary);
  }, [summary]);

  const handleExpenseAdded = (newExpense: { amount: number }) => {
    setLocalSummary((prev) => {
      if (!prev) {
        // Initialize the summary if it's null
        return {
          expense: { daily: newExpense.amount, weekly: newExpense.amount, monthly: newExpense.amount, total: newExpense.amount },
          income: { daily: 0, weekly: 0, monthly: 0, total: 0 },
        };
      }
      return {
        ...prev,
        expense: {
          daily: (prev.expense?.daily ?? 0) + newExpense.amount,
          weekly: (prev.expense?.weekly ?? 0) + newExpense.amount,
          monthly: (prev.expense?.monthly ?? 0) + newExpense.amount,
          total: (prev.expense?.total ?? 0) + newExpense.amount,
        },
      };
    });
  };

  const handleIncomeAdded = (newIncome: { amount: number }) => {
    setLocalSummary((prev) => {
      if (!prev) {
        // Initialize the summary if it's null
        return {
          expense: { daily: 0, weekly: 0, monthly: 0, total: 0 },
          income: { daily: newIncome.amount, weekly: newIncome.amount, monthly: newIncome.amount, total: newIncome.amount },
        };
      }
      return {
        ...prev,
        income: {
          daily: (prev.income?.daily ?? 0) + newIncome.amount,
          weekly: (prev.income?.weekly ?? 0) + newIncome.amount,
          monthly: (prev.income?.monthly ?? 0) + newIncome.amount,
          total: (prev.income?.total ?? 0) + newIncome.amount,
        },
      };
    });
  };

  if (loading && !localSummary) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const { income, expense } = localSummary || { income: {}, expense: {} };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex gap-4 mb-6">
        <ExpenseDrawer onExpenseAdded={handleExpenseAdded} />
        <IncomeDrawer onIncomeAdded={handleIncomeAdded} />
      </div>
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Income</h3>
            <p className="text-green-700">Daily: ${income.daily?.toFixed(2) ?? "0.00"}</p>
            <p className="text-green-700">Weekly: ${income.weekly?.toFixed(2) ?? "0.00"}</p>
            <p className="text-green-700">Monthly: ${income.monthly?.toFixed(2) ?? "0.00"}</p>
            <p className="text-green-700">Total: ${income.total?.toFixed(2) ?? "0.00"}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Expense</h3>
            <p className="text-red-700">Daily: ${expense.daily?.toFixed(2) ?? "0.00"}</p>
            <p className="text-red-700">Weekly: ${expense.weekly?.toFixed(2) ?? "0.00"}</p>
            <p className="text-red-700">Monthly: ${expense.monthly?.toFixed(2) ?? "0.00"}</p>
            <p className="text-red-700">Total: ${expense.total?.toFixed(2) ?? "0.00"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
