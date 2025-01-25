import axios from "axios";

interface IncomeData {
    amount: number;
    comment: string;
    date: Date;
    categoryId: number;
    userId: string;
}

export const useAddIncome = () => {
    const addIncome = async (data: IncomeData) => {
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
