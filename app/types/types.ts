import { PaymentMode, TransactionType } from "@prisma/client";

// Unified Transaction type
export interface Transaction {
  amount: number;
  description?: string | null;
  date: Date;
  category: string;
  paymentMode: PaymentMode;
  type: TransactionType;
  status: TransactionStatus;
  receiptUrl?: string;
  isRecurring: boolean;
  recurringInterval?: RecurringInterval | null;
  nextRecurringDate?: Date | null;
  lastProcessedDate?: Date | null;
}

// Account interface related to a transaction
export interface Account {
  id: string;
  name: string;
  type: AccountType; // Account type (CURRENT, SAVINGS)
  balance: number;
  isDefault: boolean;
  userId: string; // The user associated with this account
  user: User; // The user who owns this account
}

// AccountType enum for defining the type of account
export enum AccountType {
  CURRENT = "CURRENT",
  SAVINGS = "SAVINGS",
}

// User interface
export interface User {
  id: string;
  clerkUserId: string;
  emailAddress: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  accountLimit: number;
  transactions: Transaction[];
  accounts: Account[];
  budget: Budget[];
  createdAt: Date;
  updatedAt: Date;
}

// Budget interface for tracking user's budget
export interface Budget {
  id: string;
  amount: number;
  lastAlertSent?: Date;
  userId: string;
  user: User; // The user associated with the budget
  createdAt: Date;
  updatedAt: Date;
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

// RecurringInterval enum for recurring transaction intervals (DAILY, WEEKLY, MONTHLY, YEARLY)
export enum RecurringInterval {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

// TransactionStatus enum for transaction states (COMPLETED, PENDING, FAILED)
export enum TransactionStatus {
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
  FAILED = "FAILED",
}
