"use client";
import React from "react";
import { useSummary } from "@/app/hooks/useSummary";
import ExpenseDrawer from "./expence-drawer";
import IncomeDrawer from "./income-drawer";
import DashboardHeader from "./dashboard-header";

export default function DashboardPage() {
  const { summary, loading, error, mutate } = useSummary();
  const { income, expense } = summary || { income: {}, expense: {} };

  // Handle adding expense with optimistic UI update
  const handleExpenseAdded = (newExpense: { amount: number }) => {
    mutate(
      (prev) => {
        if (!prev) {
          // If prev is null/undefined, initialize with default values
          return {
            income: { daily: 0, weekly: 0, monthly: 0, total: 0 },
            expense: { daily: newExpense.amount, weekly: newExpense.amount, monthly: newExpense.amount, total: newExpense.amount },
          };
        }
        return {
          ...prev,
          expense: {
            daily: (prev.expense.daily || 0) + newExpense.amount,
            weekly: (prev.expense.weekly || 0) + newExpense.amount,
            monthly: (prev.expense.monthly || 0) + newExpense.amount,
            total: (prev.expense.total || 0) + newExpense.amount,
          },
        };
      },
      false // Don't re-fetch immediately, just update locally
    );
  };

  const handleIncomeAdded = (newIncome: { amount: number }) => {
    mutate(
      (prev) => {
        if (!prev) {
          // If prev is null/undefined, initialize with default values
          return {
            income: { daily: newIncome.amount, weekly: newIncome.amount, monthly: newIncome.amount, total: newIncome.amount },
            expense: { daily: 0, weekly: 0, monthly: 0, total: 0 },
          };
        }
        return {
          ...prev,
          income: {
            daily: (prev.income.daily || 0) + newIncome.amount,
            weekly: (prev.income.weekly || 0) + newIncome.amount,
            monthly: (prev.income.monthly || 0) + newIncome.amount,
            total: (prev.income.total || 0) + newIncome.amount,
          },
        };
      },
      false // Don't re-fetch immediately, just update locally
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;


  const netBalance = {
    daily: (income?.daily || 0) - (expense?.daily || 0),
    weekly: (income?.weekly || 0) - (expense?.weekly || 0),
    monthly: (income?.monthly || 0) - (expense?.monthly || 0),
    total: (income?.total || 0) - (expense?.total || 0),
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col">
      <div className="">
        <DashboardHeader />
      </div>
      <div className="flex-grow max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-4">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Today</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg shadow-md ${netBalance.daily >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <p className={`${netBalance.daily >= 0 ? 'text-green-700' : 'text-red-700'}`}>Net Balance: ${netBalance.daily.toFixed(2)}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg shadow-md">
                <p className="text-green-700">Income: ${income?.daily?.toFixed(2) ?? "0.00"}</p>
              </div>
              <div className="bg-red-100 p-4 rounded-lg shadow-md">
                <p className="text-red-700">Expense: ${expense?.daily?.toFixed(2) ?? "0.00"}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Weekly</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg shadow-md ${netBalance.weekly >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <p className={`${netBalance.weekly >= 0 ? 'text-green-700' : 'text-red-700'}`}>Net Balance: ${netBalance.weekly.toFixed(2)}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg shadow-md">
                <p className="text-green-700">Income: ${income?.weekly?.toFixed(2) ?? "0.00"}</p>
              </div>
              <div className="bg-red-100 p-4 rounded-lg shadow-md">
                <p className="text-red-700">Expense: ${expense?.weekly?.toFixed(2) ?? "0.00"}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Monthly</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg shadow-md ${netBalance.monthly >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <p className={`${netBalance.monthly >= 0 ? 'text-green-700' : 'text-red-700'}`}>Net Balance: ${netBalance.monthly.toFixed(2)}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg shadow-md">
                <p className="text-green-700">Income: ${income?.monthly?.toFixed(2) ?? "0.00"}</p>
              </div>
              <div className="bg-red-100 p-4 rounded-lg shadow-md">
                <p className="text-red-700">Expense: ${expense?.monthly?.toFixed(2) ?? "0.00"}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Total</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg shadow-md ${netBalance.total >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <p className={`${netBalance.total >= 0 ? 'text-green-700' : 'text-red-700'}`}>Net Balance: ${netBalance.total.toFixed(2)}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg shadow-md">
                <p className="text-green-700">Income: ${income?.total?.toFixed(2) ?? "0.00"}</p>
              </div>
              <div className="bg-red-100 p-4 rounded-lg shadow-md">
                <p className="text-red-700">Expense: ${expense?.total?.toFixed(2) ?? "0.00"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 p-4 flex justify-center gap-4 shadow-md">
        <ExpenseDrawer onExpenseAdded={handleExpenseAdded} />
        <IncomeDrawer onIncomeAdded={handleIncomeAdded} />
      </div>
    </div>
  );
}
