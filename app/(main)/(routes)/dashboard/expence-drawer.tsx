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
import { PaymentModeType } from "@prisma/client";
import { useAddExpense } from "@/app/hooks/useAddExpense";

export default function ExpenseDrawer({ onExpenseAdded }: { onExpenseAdded: () => void }) {
    const [open, setOpen] = React.useState(false);
    const [amount, setAmount] = React.useState(0);
    const [comment, setComment] = React.useState("");
    const [selectedCategory, setCategory] = React.useState(1); // Default to the first category
    const [selectedPaymentMode, setPaymentMode] = React.useState<PaymentModeType>(PaymentModeType.CASH);
    const date = new Date();
    const { user } = useUser();
    const { addExpense } = useAddExpense();

    const expenseCategories = [
        { id: 1, label: "Food & Dining", type: "EXPENSE" },
        { id: 2, label: "Petrol", type: "EXPENSE" },
        { id: 3, label: "Recharge & Bills", type: "EXPENSE" },
        { id: 4, label: "Travelling", type: "EXPENSE" },
        { id: 5, label: "Gift", type: "EXPENSE" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const expenseData = {
            amount,
            comment,
            date,
            categoryId: selectedCategory,
            userId: user?.id || "",
            paymentMode: selectedPaymentMode,
        };
        try {
            await addExpense(expenseData); // Use the hook
            onExpenseAdded(); // Trigger summary refresh
            setOpen(false); // Close the drawer
        } catch (error) {
            console.error("Error submitting expense:", error);
        }
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline">Add Expense</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Add Expense</DrawerTitle>
                    <DrawerDescription>
                        Enter your expense details and submit when you're ready.
                    </DrawerDescription>
                </DrawerHeader>
                <form onSubmit={handleSubmit} className="grid items-start gap-4 px-4">
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                            type="number"
                            id="amount"
                            placeholder="Enter amount"
                            required
                            onChange={(e) => setAmount(parseFloat(e.target.value))}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                            value={selectedCategory.toString()}
                            onValueChange={(value) => setCategory(Number(value))}
                        >
                            <SelectTrigger id="category">
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

                    <div className="grid gap-2">
                        <Label htmlFor="paymentMode">Payment Mode</Label>
                        <Select
                            value={selectedPaymentMode}
                            onValueChange={(value) => setPaymentMode(value as PaymentModeType)} // Use the enum
                        >
                            <SelectTrigger id="paymentMode">
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

                    <div className="grid gap-2">
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
