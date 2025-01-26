"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTransactions } from "@/app/hooks/useTransactions";
import { Button } from "@/components/ui/button";

export default function LastTransactions() {
    const { transactions, error, isLoading, loadMore, isLoadingMore, hasMore } = useTransactions();

    if (isLoading) return <p>Loading Transactions...</p>;
    if (error) return <p>Error fetching transactions: {error.message}</p>;

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Transactions</CardTitle>
            </CardHeader>
            <CardContent>
                {transactions.length === 0 ? (
                    <p className="text-gray-500 text-center">No transactions available.</p>
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
                                        className={`text-sm p-1 ${transaction.type === "INCOME"
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