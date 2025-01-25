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
import { useAddIncome } from "@/app/hooks/useAddIncome";
import { useSummary } from "@/app/hooks/useSummary";
import { Income, IncomeCategory } from "@/app/types/types";

interface IncomeDrawerProps {
    onIncomeAdded: (income: Income) => void;
}

export default function IncomeDrawer({ onIncomeAdded }: IncomeDrawerProps) {
    const [open, setOpen] = React.useState(false);
    const [amount, setAmount] = React.useState<number>(0);
    const [comment, setComment] = React.useState<string>("");
    const [selectedCategory, setCategory] = React.useState<number>(6); // Default category ID
    const { user } = useUser();
    const { addIncome } = useAddIncome();

    const incomeCategories: IncomeCategory[] = [
        { id: 6, label: "Salary", type: "INCOME" },
        { id: 7, label: "Friend", type: "INCOME" },
        { id: 8, label: "Bonuses", type: "INCOME" },
        { id: 9, label: "Gift", type: "INCOME" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const optimisticIncome = {
            id: Date.now(),
            amount,
            comment,
            date: new Date(),
            categoryId: selectedCategory,
            userId: user?.id,
        };

        onIncomeAdded(optimisticIncome); // Optimistically update the summary

        try {
            await addIncome(optimisticIncome);
        } catch (error) {
            console.error("Error submitting income:", error);
        }

        setOpen(false);
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline">Add Income</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Add Income</DrawerTitle>
                    <DrawerDescription>Enter income details below.</DrawerDescription>
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
                                {incomeCategories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.label}
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

                    <Button type="submit">Submit Income</Button>
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
