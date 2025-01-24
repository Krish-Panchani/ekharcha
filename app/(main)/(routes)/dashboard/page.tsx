"use client"
import * as React from "react";

import { cn } from "@/lib/utils";
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
import ExpenseForm from "./expence-form";
import { useUser } from "@clerk/nextjs";

export default function ExpenseDrawer() {
  const [open, setOpen] = React.useState(false);
  const [amount, setAmount] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [selectedCategory, setCategory] = React.useState(1); // Default to the first category
  const date = new Date();
  const { user } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expenseData = {
      amount,
      comment,
      category: selectedCategory, // Include the selected category
      date,
      user: user?.id,
    };
    console.log(expenseData);
    setOpen(false); // Close drawer after submit
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
        <ExpenseForm
          handleSubmit={handleSubmit}
          setAmount={setAmount}
          setComment={setComment}
          setCategory={setCategory}
          selectedCategory={selectedCategory}
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
