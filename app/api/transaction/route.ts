import { db } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

// Unified POST handler for both Income and Expense
export async function POST(req: NextRequest) {
    try {
        const { amount, comment, date, categoryId, userId, paymentMode, type } = await req.json();
        const { userId: authenticatedUserId } = getAuth(req);

        if (!authenticatedUserId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (userId !== authenticatedUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        // Ensure the type is valid (either INCOME or EXPENSE)
        if (type !== "INCOME" && type !== "EXPENSE") {
            return new NextResponse("Invalid transaction type", { status: 400 });
        }

        const transaction = await db.transaction.create({
            data: {
                amount,
                comment,
                date: new Date(date),
                categoryId,
                userId,
                paymentMode,
                type, // Transaction type (INCOME or EXPENSE)
            },
        });

        return NextResponse.json(transaction);
    } catch (error) {
        console.log("[TRANSACTION_POST]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
