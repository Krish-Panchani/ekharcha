import { useState, useEffect } from "react";
import useSWR from "swr";

interface Transaction {
  id: number;
  amount: number;
  type: string;
  category: string;
  paymentMode: string;
  date: string;
}

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody?.message || "Failed to fetch data.");
  }
  return res.json();
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const take = 10;

  const { data, error, mutate } = useSWR<Transaction[]>(
    `/api/transaction?skip=${skip}&take=${take}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  // Load initial transactions
  useEffect(() => {
    if (data) {
      setTransactions(data);
      setSkip(data.length);
      if (data.length < take) setHasMore(false);
    }
  }, [data]);

  // Add a new transaction
  const addTransaction = (newTransaction: Transaction) => {
    setTransactions((prev) => [newTransaction, ...prev]);
    mutate(); // Revalidate transactions from the API after updating locally
  };

  // Load more transactions
  const loadMore = async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);

    try {
      const newTransactions = await fetcher(
        `/api/transaction?skip=${skip}&take=${take}`
      );
      setTransactions((prev) => [...prev, ...newTransactions]);
      setSkip((prev) => prev + newTransactions.length);
      if (newTransactions.length < take) setHasMore(false);
    } catch (err) {
      console.error("Error loading more transactions:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return {
    transactions,
    error,
    isLoading: !data && !error,
    loadMore,
    isLoadingMore,
    hasMore,
    addTransaction,
    mutate,
  };
}
