// components/LastTransactions.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useTransactions } from "@/app/hooks/useTransactions";

export default function LastTransactions() {
    const { transactions, error, isLoading } = useTransactions();

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error fetching transactions: {error.message}</p>;

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Last 10 Transactions</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className="font-bold">Amount</TableCell>
                            <TableCell className="font-bold">Category</TableCell>
                            <TableCell className="font-bold">Payment Mode</TableCell>
                            <TableCell className="font-bold">Date & Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>
                                    <Badge>
                                        {transaction.amount > 0 ? "+" : ""}
                                        {transaction.amount}
                                    </Badge>
                                </TableCell>
                                <TableCell>{transaction.category.name}</TableCell>
                                <TableCell>{transaction.paymentMode}</TableCell>
                                <TableCell>
                                    {new Date(transaction.date).toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
