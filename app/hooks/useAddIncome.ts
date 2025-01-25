import axios from "axios";
import { Income } from "../types/types";

export const useAddIncome = () => {
    const addIncome = async (data: Income) => {
        try {
            await axios.post("/api/income", data);
            console.log("Income added successfully");
        } catch (error) {
            console.error("Error adding income:", error);
            throw new Error("Failed to add income");
        }
    };

    return { addIncome };
};
