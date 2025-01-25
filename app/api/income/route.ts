import { db } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { amount, comment, date, categoryId, userId } = await req.json();
        const { userId: authenticatedUserId } = getAuth(req);

        if (!authenticatedUserId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (userId !== authenticatedUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }


        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount)) {
            return new NextResponse("Invalid amount value", { status: 400 });
        }

        const income = await db.income.create({
            data: {
                amount: parsedAmount,
                comment,
                date: new Date(date), // Ensure proper date format
                categoryId,
                userId,
            },
        });

        return NextResponse.json(income);
    } catch (error) {
        console.error("[INCOME_POST]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
