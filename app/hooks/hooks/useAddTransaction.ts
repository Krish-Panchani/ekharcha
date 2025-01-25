import { Transaction } from "@/app/types/types";
import axios from "axios";

export const useAddTransaction = () => {
    const addTransaction = async (data: Transaction) => {
        try {
            await axios.post("/api/transaction", data);
            console.log(`${data.type} transaction added successfully`);
        } catch (error) {
            console.error(`Error adding ${data.type} transaction:`, error);
            throw new Error(`Failed to add ${data.type} transaction`);
        }
    };

    return { addTransaction };
};
