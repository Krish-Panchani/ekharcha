"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming ShadCN has a Skeleton component
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/app/hooks/useTransactions";

export default function LastTransactions() {
  const { transactions, error, isLoading, loadMore, isLoadingMore, hasMore } =
    useTransactions();

  if (isLoading) return <TransactionSkeleton />; // Show skeleton when loading
  if (error) return <p>Error fetching transactions: {error.message}</p>;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center">
            No transactions available.
          </p>
        ) : (
          <div className="space-y-2">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800">
                    {transaction.category.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(transaction.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    {new Date(transaction.date).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div
                    className={`text-sm p-1 ${
                      transaction.type === "INCOME"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "INCOME" ? "+" : "-"}
                    {transaction.amount}
                  </div>
                  <span className="text-sm text-gray-600">
                    {transaction.paymentMode}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        {hasMore && (
          <div className="mt-6 flex justify-center">
            <Button onClick={loadMore} disabled={isLoadingMore}>
              {isLoadingMore ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Skeleton Loader Component
function TransactionSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg shadow-sm"
            >
              <div className="flex flex-col space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Skeleton className="h-10 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}
