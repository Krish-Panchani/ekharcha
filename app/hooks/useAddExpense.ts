import axios from "axios";
import { Expense } from "../types/types";

export const useAddExpense = () => {
    const addExpense = async (data: Expense) => {
        try {
            await axios.post("/api/expense", data);
            console.log("Expense added successfully");
        } catch (error) {
            console.error("Error adding expense:", error);
            throw new Error("Failed to add expense");
        }
    };

    return { addExpense };
};
