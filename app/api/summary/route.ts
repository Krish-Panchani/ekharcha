import { db } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            console.error("[SUMMARY_GET] Unauthorized access attempt.");
            return new NextResponse("Unauthorized", { status: 401 });
        }

        console.log("[SUMMARY_GET] User ID:", userId);

        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        console.log("[SUMMARY_GET] Date Ranges:", { startOfDay, startOfWeek, startOfMonth });

        // Fetch incomes and expenses grouped by time periods
        const [dailyIncome, weeklyIncome, monthlyIncome, totalIncome] = await Promise.all([
            db.income.aggregate({
                _sum: { amount: true },
                where: { userId, date: { gte: startOfDay } },
            }),
            db.income.aggregate({
                _sum: { amount: true },
                where: { userId, date: { gte: startOfWeek } },
            }),
            db.income.aggregate({
                _sum: { amount: true },
                where: { userId, date: { gte: startOfMonth } },
            }),
            db.income.aggregate({
                _sum: { amount: true },
                where: { userId },
            }),
        ]);

        console.log("[SUMMARY_GET] Income Data:", { dailyIncome, weeklyIncome, monthlyIncome, totalIncome });

        const [dailyExpense, weeklyExpense, monthlyExpense, totalExpense] = await Promise.all([
            db.expense.aggregate({
                _sum: { amount: true },
                where: { userId, date: { gte: startOfDay } },
            }),
            db.expense.aggregate({
                _sum: { amount: true },
                where: { userId, date: { gte: startOfWeek } },
            }),
            db.expense.aggregate({
                _sum: { amount: true },
                where: { userId, date: { gte: startOfMonth } },
            }),
            db.expense.aggregate({
                _sum: { amount: true },
                where: { userId },
            }),
        ]);

        console.log("[SUMMARY_GET] Expense Data:", { dailyExpense, weeklyExpense, monthlyExpense, totalExpense });

        return NextResponse.json({
            income: {
                daily: dailyIncome._sum.amount || 0,
                weekly: weeklyIncome._sum.amount || 0,
                monthly: monthlyIncome._sum.amount || 0,
                total: totalIncome._sum.amount || 0,
            },
            expense: {
                daily: dailyExpense._sum.amount || 0,
                weekly: weeklyExpense._sum.amount || 0,
                monthly: monthlyExpense._sum.amount || 0,
                total: totalExpense._sum.amount || 0,
            },
        });
    } catch (error) {
        console.error("[SUMMARY_GET] Internal Error:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
