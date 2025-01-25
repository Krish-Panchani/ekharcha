import React from "react";

export default function NetBalanceDisplay({ income, expense }: any) {
    const netBalance = {
        total: (income?.total || 0) - (expense?.total || 0),
    };

    return (
        <div className="flex flex-col gap-4 px-2">
            <h3 className="text-sm font-semibold mb-2 px-4">All Time Total</h3>
            <div className="flex flex-col">
                <div className="flex gap-4 items-center px-4">
                    <p
                        className={`text-xl font-bold ${netBalance.total >= 0 ? "text-green-700" : "text-red-700"
                            }`}
                    >
                        {netBalance.total.toFixed(2)} ₹
                    </p>
                    <span>Net Balance</span>
                </div>
                <div className="p-4 rounded-lg shadow-md flex flex-col gap-1">
                    <p className="text-green-700">Income: {income?.total?.toFixed(2) ?? "0.00"} ₹</p>
                    <p className="text-red-700">Expense: {expense?.total?.toFixed(2) ?? "0.00"} ₹</p>
                </div>
            </div>
        </div>
    );
}
