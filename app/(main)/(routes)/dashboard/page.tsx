"use client";

import React, { useState, useEffect } from "react";
import { Transaction } from "@/app/types/types";
import DashboardHeader from "./dashboard-header";

import PeriodBalanceSkeleton from "./PeriodBalanceSkeleton";
import NetBalanceSkeleton from "./NetBalanceSkeleton";

import NetBalanceDisplay from "./NetBalanceDisplay";
import RecentTransactions from "./RecentTransactions";
import IncomeDrawer from "./income-drawer";
import ExpenseDrawer from "./expence-drawer";
import PeriodBalance from "./PeriodBalance";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useSummary } from "@/app/hooks/useSummary";
import { useTransactions } from "@/app/hooks/useTransactions";
import {
  defaultSummaryWithExpense,
  defaultSummaryWithIncome,
  updateSummary,
} from "@/app/helper/summaryHelpers";
import RecentTrend from "./RecentTrend";

export default function DashboardPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const {
    summary,
    loading: summaryLoading,
    error: summaryError,
    mutate: updateSummaryData,
  } = useSummary();
  const { transactions, addTransaction, mutate } = useTransactions();

  const [selectedPeriod, setSelectedPeriod] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");

  const handleExpenseAdded = (newExpense: Transaction) => {
    updateSummaryData((prev) => {
      if (!prev) return defaultSummaryWithExpense(newExpense.amount);
      return updateSummary(prev, newExpense.amount, "expense");
    }, false); // Prevent mutate/revalidation here

    const newTransaction = {
      id: Date.now(),
      amount: newExpense.amount,
      type: "EXPENSE",
      category: newExpense.category,
      paymentMode: newExpense.paymentMode,
      status: "COMPLETED",
      date: new Date().toISOString(),
      description: newExpense.description,
      isRecurring: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addTransaction(newTransaction);
  };

  const handleIncomeAdded = (newIncome: Transaction) => {
    updateSummaryData((prev) => {
      if (!prev) return defaultSummaryWithIncome(newIncome.amount);
      return updateSummary(prev, newIncome.amount, "income");
    }, false); // Prevent mutate/revalidation here

    const newTransaction = {
      id: Date.now(),
      amount: newIncome.amount,
      type: "INCOME",
      category: newIncome.category,
      paymentMode: newIncome.paymentMode,
      status: "COMPLETED",
      date: new Date().toISOString(),
      description: newIncome.description,
      isRecurring: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addTransaction(newTransaction); // Add new transaction
  };

  if (summaryError) return <p>Error: {summaryError.message}</p>;

  const { income, expense } = summary || {
    income: { daily: 0, weekly: 0, monthly: 0, total: 0 },
    expense: { daily: 0, weekly: 0, monthly: 0, total: 0 },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      <div className="bg-white py-4 mt-4">
        {summaryLoading ? (
          <NetBalanceSkeleton />
        ) : (
          <NetBalanceDisplay income={income} expense={expense} />
        )}
        <div className="mt-6"></div>
        {summaryLoading ? (
          <PeriodBalanceSkeleton />
        ) : (
          <PeriodBalance
            income={income}
            expense={expense}
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        )}
      </div>

      <div className="px-2 space-y-4">
        <RecentTrend />
        <RecentTransactions />
      </div>
      <div className="sticky bottom-0 left-0 right-0 bg-gray-100 p-4 flex justify-center gap-4 shadow-md">
        <ExpenseDrawer onTransactionAdded={handleExpenseAdded} />
        <IncomeDrawer onTransactionAdded={handleIncomeAdded} />
      </div>
    </div>
  );
}
