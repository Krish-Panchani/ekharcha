import useSWR from "swr";
import axios from "axios";
import { Summary } from "../types/types";

// Fetcher function that SWR will use for data fetching
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useSummary = () => {
    // Use SWR hook to fetch and cache the summary data
    const { data, error, mutate } = useSWR<Summary>("/api/summary", fetcher, {
        revalidateOnFocus: false,  // Disable revalidation when tab refocuses
        dedupingInterval: 60000,   // Deduplicate requests for 60 seconds
    });

    // If you want to update summary manually, use mutate()
    const refetchSummary = () => {
        mutate();  // Re-fetch the summary data
    };

    return {
        summary: data,   // Cached summary data
        loading: !data && !error,   // Loading state
        error,            // Error state
        refetchSummary,   // Function to manually trigger re-fetching
        mutate,           // Function to manually update the cached data
    };
};
