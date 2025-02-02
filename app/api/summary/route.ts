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

        // Fetch income and expense data for all periods in one query
        const results = await Promise.all([
            db.transaction.groupBy({
                by: ["type"],
                _sum: { amount: true },
                where: { userId, date: { gte: startOfDay } },
            }),
            db.transaction.groupBy({
                by: ["type"],
                _sum: { amount: true },
                where: { userId, date: { gte: startOfWeek } },
            }),
            db.transaction.groupBy({
                by: ["type"],
                _sum: { amount: true },
                where: { userId, date: { gte: startOfMonth } },
            }),
            db.transaction.groupBy({
                by: ["type"],
                _sum: { amount: true },
                where: { userId },
            }),
        ]);

        // Extract and format the data for each time period
        const formatResults = (groupedResults: any) => {
            const income = groupedResults.find((res: any) => res.type === "INCOME")?._sum.amount || 0;
            const expense = groupedResults.find((res: any) => res.type === "EXPENSE")?._sum.amount || 0;
            return { income, expense };
        };

        const [daily, weekly, monthly, total] = results.map(formatResults);

        return NextResponse.json({
            income: {
                daily: daily.income,
                weekly: weekly.income,
                monthly: monthly.income,
                total: total.income,
            },
            expense: {
                daily: daily.expense,
                weekly: weekly.expense,
                monthly: monthly.expense,
                total: total.expense,
            },
        });
    } catch (error) {
        console.error("[SUMMARY_GET] Internal Error:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
