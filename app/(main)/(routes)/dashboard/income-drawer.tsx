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
import { PaymentMode, TransactionType } from "@prisma/client";
import { useAddTransaction } from "@/app/hooks/useAddTransaction";
import { Transaction, TransactionStatus } from "@/app/types/types";

interface IncomeDrawerProps {
  onTransactionAdded: (transaction: Transaction) => void;
}

export default function IncomeDrawer({
  onTransactionAdded,
}: IncomeDrawerProps) {
  const [open, setOpen] = React.useState(false);
  const [amount, setAmount] = React.useState<number>(0);
  const [description, setDescription] = React.useState<string>("");
  const [selectedCategory, setCategory] = React.useState<string>("Salary");
  const [selectedPaymentMode, setPaymentMode] = React.useState<PaymentMode>(
    PaymentMode.UPI
  );

  const { addTransaction } = useAddTransaction();

  // List of income categories, modify as needed
  const incomeCategories: { id: number; label: string }[] = [
    { id: 1, label: "Salary" },
    { id: 2, label: "Freelance" },
    { id: 3, label: "Investment" },
    { id: 4, label: "Gift" },
    { id: 5, label: "Other" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const optimisticTransaction: Transaction = {
      amount,
      description,
      date: new Date(), // Add the current date as the date of the transaction
      category: selectedCategory,
      receiptUrl: "",
      paymentMode: selectedPaymentMode,
      type: TransactionType.INCOME,
      status: TransactionStatus.COMPLETED,
      isRecurring: false,
      recurringInterval: null,
      nextRecurringDate: null,
      lastProcessedDate: null,
    };

    onTransactionAdded(optimisticTransaction);
    setOpen(false);

    try {
      // Sending transaction data to the backend API
      await addTransaction({
        amount,
        description,
        date: new Date(),
        category: selectedCategory,
        paymentMode: selectedPaymentMode,
        type: TransactionType.INCOME,
        status: TransactionStatus.COMPLETED,
        isRecurring: false,
      });
    } catch (error) {
      console.error("Error submitting transaction:", error);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="border-green-400 text-green-500">
          Add Income
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add Income</DrawerTitle>
          <DrawerDescription>
            Enter transaction details below.
          </DrawerDescription>
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
              value={selectedCategory}
              onValueChange={(value) => setCategory(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {incomeCategories.map((category) => (
                  <SelectItem key={category.id} value={category.label}>
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
              onValueChange={(value) => setPaymentMode(value as PaymentMode)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment mode" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(PaymentMode).map((mode) => (
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
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button type="submit">Add Income</Button>
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
