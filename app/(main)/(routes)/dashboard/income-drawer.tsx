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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@clerk/nextjs";
import { PaymentModeType, Transaction, TransactionType } from "@prisma/client"; // Unified transaction types
import { useAddTransaction } from "@/app/hooks/useAddTransaction";

interface IncomeDrawerProps {
  onTransactionAdded: (transaction: Transaction) => void;
}

export default function IncomeDrawer({
  onTransactionAdded,
}: IncomeDrawerProps) {
  const [open, setOpen] = React.useState(false);
  const [amount, setAmount] = React.useState<number>(0);
  const [comment, setComment] = React.useState<string>("");
  const [selectedCategory, setCategory] = React.useState<number>(6); // Default category ID for "Salary"
  const [selectedPaymentMode, setPaymentMode] = React.useState<PaymentModeType>(
    PaymentModeType.UPI
  ); // Default payment mode
  const [transactionType, setTransactionType] = React.useState<TransactionType>(
    TransactionType.INCOME
  ); // Fixed as INCOME by default
  const { user } = useUser();
  const { addTransaction } = useAddTransaction(); // Using the new addTransaction hook

  const incomeCategories: { id: number; label: string }[] = [
    { id: 6, label: "Salary" },
    { id: 7, label: "Friend" },
    { id: 8, label: "Bonuses" },
    { id: 9, label: "Gift" },
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
      type: TransactionType.INCOME, // Ensure transaction type is "INCOME"
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onTransactionAdded(optimisticTransaction); // Optimistically update the summary

    try {
      await addTransaction(optimisticTransaction); // Call the new hook for adding transactions
    } catch (error) {
      console.error("Error submitting income:", error);
    }

    setOpen(false); // Close the drawer after submission
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
              className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-none focus-visible:ring-0 text-3xl md:text-3xl py-4 md:py-4 h-auto"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={selectedCategory.toString()}
              onValueChange={(value) => setCategory(Number(value))}
            >
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
            <Label htmlFor="paymentMode">Payment Mode</Label>
            <Select
              value={selectedPaymentMode}
              onValueChange={(value) =>
                setPaymentMode(value as PaymentModeType)
              }
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
