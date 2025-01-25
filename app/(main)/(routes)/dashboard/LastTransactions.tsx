"use client";

import React from "react";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Transaction {
    id: number;
    amount: number;
    category: { name: string }; // Assuming category object has `label`
    paymentMode: string;
    date: string; // ISO format
}

async function fetcher(url: string) {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
}

export default function LastTransactions() {
    const { data, error, isLoading } = useSWR<Transaction[]>("/api/transaction", fetcher);

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
                        {data && data.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>
                                    <Badge
                                        variant={transaction.amount > 0 ? "default" : "destructive"}
                                    >
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
