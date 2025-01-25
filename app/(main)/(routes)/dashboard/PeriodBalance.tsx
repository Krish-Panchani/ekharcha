import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PeriodBalance({
    income,
    expense,
    selectedPeriod,
    onPeriodChange,
}: {
    income: { daily: number; weekly: number; monthly: number };
    expense: { daily: number; weekly: number; monthly: number };
    selectedPeriod: 'daily' | 'weekly' | 'monthly';
    onPeriodChange: (value: 'daily' | 'weekly' | 'monthly') => void;
}) {
    const netBalance = {
        daily: (income?.daily || 0) - (expense?.daily || 0),
        weekly: (income?.weekly || 0) - (expense?.weekly || 0),
        monthly: (income?.monthly || 0) - (expense?.monthly || 0),
    };

    const periodData = {
        income: income?.[selectedPeriod],
        expense: expense?.[selectedPeriod],
        netBalance: netBalance[selectedPeriod],
    };

    return (
        <div className="flex flex-col gap-4 px-2">
            <div className="flex justify-between items-center px-4">
                <h3 className="text-sm font-semibold">
                    {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}
                </h3>
                <Select value={selectedPeriod} onValueChange={onPeriodChange}>
                    <SelectTrigger className="btn border rounded-lg p-2">
                        <SelectValue placeholder="Select Period" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="daily">Today</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex flex-col">
                <div className="flex gap-4 items-center px-4">
                    <p
                        className={`text-xl font-bold ${periodData.netBalance >= 0 ? "text-green-700" : "text-red-700"
                            }`}
                    >
                        {periodData.netBalance.toFixed(2)} ₹
                    </p>
                    <span>Net Balance</span>
                </div>
                <div className="p-4 rounded-lg shadow-md flex flex-col gap-1">
                    <p className="text-green-700">Income: {periodData.income?.toFixed(2) ?? "0.00"} ₹</p>
                    <p className="text-red-700">Expense: {periodData.expense?.toFixed(2) ?? "0.00"} ₹</p>
                </div>
            </div>
        </div>
    );
}
