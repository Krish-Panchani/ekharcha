import { useState, useEffect } from "react";
import axios from "axios";

export interface Summary {
    income: {
        daily: number;
        weekly: number;
        monthly: number;
        total: number;
    };
    expense: {
        daily: number;
        weekly: number;
        monthly: number;
        total: number;
    };
}

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
            setError("Failed to fetch summary data.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, []);

    return { summary, loading, error, fetchSummary };
};
