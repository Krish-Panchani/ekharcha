"use client";

import React, { useState } from "react";
import DashboardHeader from "./dashboard-header";
import { useSummary } from "@/app/hooks/useSummary";
import NetBalanceDisplay from "./NetBalanceDisplay";
import LastTransactions from "./LastTransactions";
import IncomeDrawer from "./income-drawer";
import ExpenseDrawer from "./expence-drawer";
import {
  defaultSummaryWithExpense,
  defaultSummaryWithIncome,
  updateSummary,
} from "@/app/helper/summaryHelpers";
import PeriodBalance from "./PeriodBalance";
import { useTransactions } from "@/app/hooks/useTransactions";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in"); // Redirect if user is not signed in
    }
  }, [isSignedIn, router]);

  if (!isSignedIn) {
    return <p>Redirecting to Sign In...</p>; // Show this while redirecting
  }

  const { summary, loading: summaryLoading, error: summaryError, mutate: updateSummaryData } =
    useSummary();
  const { transactions, addTransaction } = useTransactions();

  const [selectedPeriod, setSelectedPeriod] = useState<"daily" | "weekly" | "monthly">("daily");

  const handleExpenseAdded = (newExpense: { amount: number }) => {
    updateSummaryData(
      (prev) => {
        if (!prev) return defaultSummaryWithExpense(newExpense.amount);
        return updateSummary(prev, newExpense.amount, "expense");
      },
      false
    );

    const newTransaction = {
      id: Date.now(),
      amount: newExpense.amount,
      type: "EXPENSE",
      category: { name: "Expense" },
      paymentMode: "Cash",
      date: new Date().toISOString(),
    };

    addTransaction(newTransaction);
  };

  const handleIncomeAdded = (newIncome: { amount: number }) => {
    updateSummaryData(
      (prev) => {
        if (!prev) return defaultSummaryWithIncome(newIncome.amount);
        return updateSummary(prev, newIncome.amount, "income");
      },
      false
    );

    const newTransaction = {
      id: Date.now(),
      amount: newIncome.amount,
      type: "INCOME",
      category: { name: "Income" },
      paymentMode: "Bank",
      date: new Date().toISOString(),
    };

    addTransaction(newTransaction);
  };

  if (summaryLoading) return <p>Loading...</p>;
  if (summaryError) return <p>Error: {summaryError.message}</p>;

  const { income, expense } = summary || {
    income: { daily: 0, weekly: 0, monthly: 0, total: 0 },
    expense: { daily: 0, weekly: 0, monthly: 0, total: 0 },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      <div className="bg-white py-4 mt-4">
        <NetBalanceDisplay income={income} expense={expense} />
        <div className="mt-6"></div>
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
