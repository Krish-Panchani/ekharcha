import { useState, useEffect } from "react";
import useSWR from "swr";
import axios from "axios";

interface Transaction {
  id: number;
  amount: number;
  type: string;
  category: string;
  paymentMode: string;
  date: string;
}

// Fetcher function that SWR will use for data fetching
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useTransactions() {
  const [skip, setSkip] = useState(0);
  const take = 10;

  // Use SWR hook to fetch and cache the transactions data
  const { data, error, mutate, isValidating } = useSWR<Transaction[]>(
    `/api/transaction?skip=${skip}&take=${take}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      keepPreviousData: true, // This prevents data flickering when paginating
    }
  );

  const isLoading = !data && !error;
  const hasMore = data?.length === take;

  // Add a new transaction
  const addTransaction = (newTransaction: Transaction) => {
    mutate((prev) => [newTransaction, ...(prev || [])], false); // Optimistically update the local cache
  };

  // Load more transactions
  const loadMore = () => {
    if (!hasMore || isValidating) return;
    setSkip((prev) => prev + take);
  };

  return {
    transactions: data || [],
    error,
    isLoading,
    loadMore,
    isLoadingMore: isValidating,
    hasMore,
    addTransaction,
    mutate,
  };
}
