"use client";

import React, { useState } from "react";
import DashboardHeader from "./dashboard-header";
import { useSummary } from "@/app/hooks/useSummary";
import NetBalanceDisplay from "./NetBalanceDisplay";
import LastTransactions from "./LastTransactions";
import IncomeDrawer from "./income-drawer";
import { defaultSummaryWithExpense, defaultSummaryWithIncome, updateSummary } from "@/app/helper/summaryHelpers";
import PeriodBalance from "./PeriodBalance";
import ExpenseDrawer from "./expence-drawer";

export default function DashboardPage() {
  const { summary, loading, error, mutate } = useSummary();
  const [selectedPeriod, setSelectedPeriod] = useState<"daily" | "weekly" | "monthly">("daily");

  const handleExpenseAdded = (newExpense: { amount: number }) => {
    mutate(
      (prev) => {
        if (!prev) return defaultSummaryWithExpense(newExpense.amount);
        return updateSummary(prev, newExpense.amount, "expense");
      },
      false
    );
  };

  const handleIncomeAdded = (newIncome: { amount: number }) => {
    mutate(
      (prev) => {
        if (!prev) return defaultSummaryWithIncome(newIncome.amount);
        return updateSummary(prev, newIncome.amount, "income");
      },
      false
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const { income, expense } = summary || { income: { daily: 0, weekly: 0, monthly: 0, total: 0 }, expense: { daily: 0, weekly: 0, monthly: 0, total: 0 } };

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      <div className="bg-white py-4 mt-4">
        <NetBalanceDisplay income={income} expense={expense} />
        <PeriodBalance
          income={income}
          expense={expense}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
      </div>
      <LastTransactions />
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 p-4 flex justify-center gap-4 shadow-md">
        <ExpenseDrawer onTransactionAdded={handleExpenseAdded} />
        <IncomeDrawer onTransactionAdded={handleIncomeAdded} />
      </div>
    </div>
  );
}
