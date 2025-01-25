import { PaymentModeType } from "@prisma/client";


export interface Expense {
    id: number;
    amount: number;
    comment: string;
    date: Date;
    categoryId: number;
    userId: string | undefined;
    paymentMode: PaymentModeType;
}

export interface Income {
    id: number;
    amount: number;
    comment: string;
    date: Date;
    categoryId: number;
    userId: string | undefined;
}

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

export interface ExpenseCategory {
    id: number;
    label: string;
    type: "EXPENSE";
}

export interface IncomeCategory {
    id: number;
    label: string;
    type: "INCOME";
}