"use client";
import React, { useState } from "react";
import { useSummary } from "@/app/hooks/useSummary";
import ExpenseDrawer from "./expence-drawer";
import IncomeDrawer from "./income-drawer";
import DashboardHeader from "./dashboard-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import from shadcn library
import LastTransactions from "./LastTransactions";

export default function DashboardPage() {
  const { summary, loading, error, mutate } = useSummary();
  const { income, expense } = summary || { income: {}, expense: {} };

  const [selectedPeriod, setSelectedPeriod] = useState("daily");

  // Handle adding expense with optimistic UI update
  const handleExpenseAdded = (newExpense: { amount: number }) => {
    mutate(
      (prev) => {
        if (!prev) {
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

  const getPeriodData = (period: string) => {
    switch (period) {
      case "weekly":
        return {
          income: income?.weekly,
          expense: expense?.weekly,
          netBalance: netBalance.weekly,
        };
      case "monthly":
        return {
          income: income?.monthly,
          expense: expense?.monthly,
          netBalance: netBalance.monthly,
        };
      default:
        return {
          income: income?.daily,
          expense: expense?.daily,
          netBalance: netBalance.daily,
        };
    }
  };

  const { income: periodIncome, expense: periodExpense, netBalance: periodNetBalance } = getPeriodData(selectedPeriod);

  return (
    <div className="min-h-screen flex flex-col">
      <div>
        <DashboardHeader />
      </div>

      <div className="bg-white py-4 mt-4">
        <div className="flex flex-col gap-4 px-2">
          {/* Show Total Data below each period */}
          <div>
            <h3 className="text-sm font-semibold mb-2 px-4">All Time Total</h3>
            <div className="flex flex-col">
              <div className="flex gap-4 items-center px-4">
                <p className={`text-xl font-bold ${netBalance.total >= 0 ? 'text-green-700' : 'text-red-700'}`}>{netBalance.total.toFixed(2)} ₹
                </p>
                <span>Net Balance</span>
              </div>
              <div className=" p-4 rounded-lg shadow-md flex flex-col gap-1">
                <p className="text-green-700">Income: {income?.total?.toFixed(2) ?? "0.00"} ₹</p>
                <p className="text-red-700">Expense: {expense?.total?.toFixed(2) ?? "0.00"} ₹</p>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center px-4">
            <h3 className="text-sm font-semibold">{selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}</h3>
            <div className="flex justify-end">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="btn border rounded-lg p-2">
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Today</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex gap-4 items-center px-4">
              <p className={`text-xl font-bold ${periodNetBalance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {periodNetBalance.toFixed(2)} ₹</p>
              <span>Net Balance</span>
              {/* Period selection using Select component */}

            </div>
            <div className=" p-4 rounded-lg shadow-md flex flex-col gap-1">
              <p className="text-green-700">Income: {periodIncome?.toFixed(2) ?? "0.00"} ₹</p>
              <p className="text-red-700">Expense: {periodExpense?.toFixed(2) ?? "0.00"} ₹</p>
            </div>
          </div>
        </div>
      </div>
      <LastTransactions />

      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 p-4 flex justify-center gap-4 shadow-md">
        <ExpenseDrawer onTransactionAdded={handleExpenseAdded} />
        <IncomeDrawer onTransactionAdded={handleIncomeAdded} />
      </div>
    </div>
  );
}
