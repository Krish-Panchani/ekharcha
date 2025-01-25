"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@clerk/nextjs";
import { PaymentModeType, Transaction, TransactionType } from "@prisma/client";
import { useAddTransaction } from "@/app/hooks/useAddTransaction";
// Import the TransactionType from your types

interface ExpenseDrawerProps {
    onTransactionAdded: (transaction: Transaction) => void;
}

export default function ExpenseDrawer({ onTransactionAdded }: ExpenseDrawerProps) {
    const [open, setOpen] = React.useState(false);
    const [amount, setAmount] = React.useState<number>(0);
    const [comment, setComment] = React.useState<string>("");
    const [selectedCategory, setCategory] = React.useState<number>(1);
    const [selectedPaymentMode, setPaymentMode] = React.useState<PaymentModeType>(PaymentModeType.CASH);
    const [transactionType, setTransactionType] = React.useState<TransactionType>(TransactionType.EXPENSE); // Add transaction type
    const { user } = useUser();
    const { addTransaction } = useAddTransaction();

    const expenseCategories: { id: number, label: string }[] = [
        { id: 1, label: "Food & Dining" },
        { id: 2, label: "Petrol" },
        { id: 3, label: "Recharge & Bills" },
        { id: 4, label: "Traveling" },
        { id: 5, label: "Gift" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const optimisticTransaction = {
            id: Date.now(), // Use Date.now() for optimistic ID
            amount,
            comment,
            date: new Date(),
            categoryId: selectedCategory,
            userId: user?.id || "",
            paymentMode: selectedPaymentMode,
            type: TransactionType.EXPENSE, // Use selected transaction type (INCOME/EXPENSE)
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        onTransactionAdded(optimisticTransaction); // Optimistically update the summary

        try {
            await addTransaction(optimisticTransaction); // Call the addTransaction hook
        } catch (error) {
            console.error("Error submitting transaction:", error);
        }

        setOpen(false); // Close the drawer
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline">Add Expense</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Add Transaction</DrawerTitle>
                    <DrawerDescription>Enter transaction details below.</DrawerDescription>
                </DrawerHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 px-4">
                    <div>
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                            type="number"
                            id="amount"
                            placeholder="Enter amount"
                            required
                            onChange={(e) => setAmount(parseFloat(e.target.value))}
                        />
                    </div>

                    <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={selectedCategory.toString()} onValueChange={(value) => setCategory(Number(value))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {expenseCategories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="paymentMode">Payment Mode</Label>
                        <Select
                            value={selectedPaymentMode}
                            onValueChange={(value) => setPaymentMode(value as PaymentModeType)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select payment mode" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(PaymentModeType).map((mode) => (
                                    <SelectItem key={mode} value={mode}>
                                        {mode}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="comment">Comment</Label>
                        <Textarea
                            id="comment"
                            placeholder="Optional comment"
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>

                    {/* Dropdown to select transaction type (INCOME/EXPENSE) */}
                    {/* <div>
                        <Label htmlFor="transactionType">Transaction Type</Label>
                        <Select
                            value={transactionType}
                            onValueChange={(value) => setTransactionType(value as TransactionType)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select transaction type" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(TransactionType).map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div> */}

                    <Button type="submit">Submit Transaction</Button>
                </form>
                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
