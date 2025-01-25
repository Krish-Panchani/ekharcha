import { useState, useEffect } from "react";
import axios from "axios";
import { Summary } from "../types/types";

export const useSummary = () => {
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSummary = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("/api/summary");
            setSummary(response.data);
        } catch (err) {
            console.error("Error fetching summary data:", err);
            setSummary({ expense: { daily: 0, weekly: 0, monthly: 0, total: 0 }, income: { daily: 0, weekly: 0, monthly: 0, total: 0 } }); // Default fallback
            setError("Failed to fetch summary data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, []);

    return { summary, loading, error, fetchSummary };
};
