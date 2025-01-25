// hooks/useTransactions.ts
import { useState, useEffect } from "react";
import useSWR from "swr";

interface Transaction {
    id: number;
    amount: number;
    category: { name: string };
    paymentMode: string;
    date: string;
}

async function fetcher(url: string) {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
}

export function useTransactions() {
    const { data, error, mutate } = useSWR<Transaction[]>("/api/transaction", fetcher);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // Update local state when data changes
    useEffect(() => {
        if (data) {
            setTransactions(data.slice(0, 10)); // Only take the last 10 transactions
        }
    }, [data]);

     // Add transaction locally and also trigger SWR mutate
     const addTransaction = (newTransaction: Transaction) => {
        setTransactions((prevTransactions) => [newTransaction, ...prevTransactions.slice(0, 9)]);
        mutate(undefined, { revalidate: false }); // Disable revalidation here
    };

    return {
        transactions,
        error,
        isLoading: !data && !error,
        addTransaction,
        mutate, // Allow the parent to manually trigger re-fetch if needed
    };
}
