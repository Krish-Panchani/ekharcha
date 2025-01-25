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
import { useAddExpense } from "@/app/hooks/useAddExpense";
import { useSummary } from "@/app/hooks/useSummary";
import { PaymentModeType } from "@prisma/client";
import { Expense, ExpenseCategory } from "@/app/types/types";

interface ExpenseDrawerProps {
    onExpenseAdded: (expense: Expense) => void;
}

export default function ExpenseDrawer({ onExpenseAdded }: ExpenseDrawerProps) {
    const [open, setOpen] = React.useState(false);
    const [amount, setAmount] = React.useState<number>(0);
    const [comment, setComment] = React.useState<string>("");
    const [selectedCategory, setCategory] = React.useState<number>(1);
    const [selectedPaymentMode, setPaymentMode] = React.useState<PaymentModeType>(PaymentModeType.CASH);
    const { user } = useUser();
    const { addExpense } = useAddExpense();

    const expenseCategories: ExpenseCategory[] = [
        { id: 1, label: "Food & Dining", type: "EXPENSE" },
        { id: 2, label: "Petrol", type: "EXPENSE" },
        { id: 3, label: "Recharge & Bills", type: "EXPENSE" },
        { id: 4, label: "Traveling", type: "EXPENSE" },
        { id: 5, label: "Gift", type: "EXPENSE" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const optimisticExpense = {
            id: Date.now(),
            amount,
            comment,
            date: new Date(),
            categoryId: selectedCategory,
            userId: user?.id,
            paymentMode: selectedPaymentMode,
        };

        onExpenseAdded(optimisticExpense); // Optimistically update the summary

        try {
            await addExpense(optimisticExpense);
        } catch (error) {
            console.error("Error submitting expense:", error);
        }

        setOpen(false);
    };


    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline">Add Expense</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Add Expense</DrawerTitle>
                    <DrawerDescription>Enter expense details below.</DrawerDescription>
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

                    <Button type="submit">Submit Expense</Button>
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
