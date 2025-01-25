import { PaymentModeType, TransactionType,  } from "@prisma/client";

// Unified Transaction type
export interface Transaction {
    id: number;
    amount: number;
    comment?: string; // Optional comment
    date: Date;
    categoryId: number;
    userId: string | undefined;
    type: TransactionType; // INCOME or EXPENSE
    paymentMode: PaymentModeType; // UPI, CASH, WALLET, or CARD
}

// Summary interface for daily, weekly, monthly, and total income/expense
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

// Category interface for both income and expense categories
export interface Category {
    id: number;
    label: string;
    type: TransactionType; // INCOME or EXPENSE
}

// You can now have a unified model for transactions without having separate Expense and Income models
