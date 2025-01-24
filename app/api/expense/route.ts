import { db } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { amount, comment, date, categoryId, userId, paymentMode } = await req.json();
        const { userId: authenticatedUserId } = getAuth(req);

        if (!authenticatedUserId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (userId !== authenticatedUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const expense = await db.expense.create({
            data: {
                amount,
                comment,
                date: new Date(date), // Ensure proper date format
                categoryId,
                userId,
                paymentMode,
            },
        });

        return NextResponse.json(expense);
    } catch (error) {
        console.log("[EXPENSE_POST]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
