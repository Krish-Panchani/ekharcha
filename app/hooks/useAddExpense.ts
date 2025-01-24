import axios from "axios";

interface ExpenseData {
    amount: number;
    comment: string;
    date: Date;
    categoryId: number;
    userId: string;
    paymentMode: string; // Or PaymentModeType if you use the enum
}

export const useAddExpense = () => {
    const addExpense = async (data: ExpenseData) => {
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
