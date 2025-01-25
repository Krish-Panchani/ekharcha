"use client";
import React from "react";
import { useSummary } from "@/app/hooks/useSummary";
import ExpenseDrawer from "./expence-drawer";
import IncomeDrawer from "./income-drawer";

export default function DashboardPage() {
  const { summary, loading, error, fetchSummary } = useSummary();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const { income, expense } = summary || { income: {}, expense: {} };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ExpenseDrawer onExpenseAdded={fetchSummary} />
      <IncomeDrawer onIncomeAdded={fetchSummary} />
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
