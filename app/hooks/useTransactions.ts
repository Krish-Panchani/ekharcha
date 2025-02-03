import { useState } from "react";
import useSWRInfinite from "swr/infinite";
import axios from "axios";

export interface Transaction {
  id: number;
  amount: number;
  type: string;
  category: string;
  paymentMode: string;
  date: string;
}

// Fetcher function for SWR
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useTransactions() {
  const take = 10; // Number of items per page

  // Using useSWRInfinite for pagination
  const { data, error, mutate, isValidating, setSize } = useSWRInfinite(
    (index) => `/api/transaction?skip=${index * take}&take=${take}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      keepPreviousData: true, // Keeps previous data while loading more
    }
  );

  // Checking if data is loading
  const isLoading = !data && !error;

  // Checking if there's more data to load (when data length is equal to the requested `take`)
  const hasMore = data?.[data.length - 1]?.length === take;

  // Flattening the data from all pages
  const transactions = data ? [].concat(...data) : [];

  // Load more data when the user clicks "Load More"
  const loadMore = () => {
    if (isValidating || !hasMore) return; // Prevents loading more if already loading or no more data
    setSize((prev) => prev + 1); // Increases the number of pages to load
  };

  // Adding a new transaction (optimistic update)
  const addTransaction = (newTransaction: Transaction) => {
    mutate((prev) => [newTransaction, ...(prev || [])], false); // Update local cache optimistically
  };

  return {
    transactions,
    error,
    isLoading,
    loadMore,
    isLoadingMore: isValidating,
    hasMore,
    addTransaction,
    mutate,
  };
}
