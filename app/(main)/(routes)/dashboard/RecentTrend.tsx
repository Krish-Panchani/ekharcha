"use client";

import React from "react";
import { useTransactions } from "@/app/hooks/useTransactions"; // Assuming this is the hook where transactions come from
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { TrendingUp, TrendingDown, ArrowRight } from "react-icons/fa"; // You can import the icons from react-icons
import { Transaction } from "@/app/types/types";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";

export default function RecentTrend() {
  const { transactions, isLoading, error } = useTransactions();

  // If transactions are loading or there's an error, show a placeholder or error message
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching transactions: {error.message}</div>;

  // Get the trend using the getTransactionTrend function
  const trend = getTransactionTrend(transactions);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Recent Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          {trend === "positive" && (
            <TrendingUp className="text-green-500 mr-2" />
          )}
          {trend === "negative" && (
            <TrendingDown className="text-red-500 mr-2" />
          )}
          {trend === "neutral" && <ArrowRight className="text-gray-500 mr-2" />}
          <span className="text-sm sm:text-base">
            {trend === "positive" &&
              "Your recent transactions show more income than expenses."}
            {trend === "negative" &&
              "Your recent transactions show more expenses than income."}
            {trend === "neutral" &&
              "Your recent income and expenses are balanced."}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// Function to calculate the trend based on transactions
const getTransactionTrend = (transactions: Transaction[]) => {
  const recentTransactions = transactions.slice(-5);

  const incomeTotal = recentTransactions
    .filter((t) => t.type === "INCOME")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expenseTotal = recentTransactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, curr) => acc + curr.amount, 0);

  if (incomeTotal > expenseTotal) {
    return "positive";
  } else if (incomeTotal < expenseTotal) {
    return "negative";
  } else {
    return "neutral";
  }
};
