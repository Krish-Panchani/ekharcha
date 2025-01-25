import { db } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            console.error("[SUMMARY_GET] Unauthorized access attempt.");
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const [dailyTransaction, weeklyTransaction, monthlyTransaction, totalTransaction] = await Promise.all([
            db.transaction.aggregate({
                _sum: { amount: true },
                where: { userId, date: { gte: startOfDay } },
            }),
            db.transaction.aggregate({
                _sum: { amount: true },
                where: { userId, date: { gte: startOfWeek } },
            }),
            db.transaction.aggregate({
                _sum: { amount: true },
                where: { userId, date: { gte: startOfMonth } },
            }),
            db.transaction.aggregate({
                _sum: { amount: true },
                where: { userId },
            }),
        ]);

        // Extract income and expense amounts, ensuring we don't apply filter to numbers
        const dailyIncome = dailyTransaction._sum.amount && dailyTransaction._sum.amount > 0 ? dailyTransaction._sum.amount : 0;
        const weeklyIncome = weeklyTransaction._sum.amount && weeklyTransaction._sum.amount > 0 ? weeklyTransaction._sum.amount : 0;
        const monthlyIncome = monthlyTransaction._sum.amount && monthlyTransaction._sum.amount > 0 ? monthlyTransaction._sum.amount : 0;
        const totalIncome = totalTransaction._sum.amount && totalTransaction._sum.amount > 0 ? totalTransaction._sum.amount : 0;

        const dailyExpense = dailyTransaction._sum.amount && dailyTransaction._sum.amount < 0 ? dailyTransaction._sum.amount : 0;
        const weeklyExpense = weeklyTransaction._sum.amount && weeklyTransaction._sum.amount < 0 ? weeklyTransaction._sum.amount : 0;
        const monthlyExpense = monthlyTransaction._sum.amount && monthlyTransaction._sum.amount < 0 ? monthlyTransaction._sum.amount : 0;
        const totalExpense = totalTransaction._sum.amount && totalTransaction._sum.amount < 0 ? totalTransaction._sum.amount : 0;

        return NextResponse.json({
            income: {
                daily: dailyIncome || 0,
                weekly: weeklyIncome || 0,
                monthly: monthlyIncome || 0,
                total: totalIncome || 0,
            },
            expense: {
                daily: dailyExpense || 0,
                weekly: weeklyExpense || 0,
                monthly: monthlyExpense || 0,
                total: totalExpense || 0,
            },
        });
    } catch (error) {
        console.error("[SUMMARY_GET] Internal Error:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
