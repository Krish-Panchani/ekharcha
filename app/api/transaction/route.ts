import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

// Unified POST handler for both Income and Expense
export async function POST(req: NextRequest) {
  try {
    const { amount, description, date, category, paymentMode, type } =
      await req.json();
    const { userId: authenticatedUserId } = getAuth(req);
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Profile not found", { status: 404 });
    }
    // const { id } = profile;

    if (!authenticatedUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Ensure the transaction type is valid (either INCOME or EXPENSE)
    if (type !== "INCOME" && type !== "EXPENSE") {
      return new NextResponse("Invalid transaction type", { status: 400 });
    }

    // Fetch the user's default account
    const defaultAccount = await db.account.findFirst({
      where: {
        userId: profile.id,
        isDefault: true,
      },
    });

    if (!defaultAccount) {
      return new NextResponse("No default account found for this user.", {
        status: 400,
      });
    }

    // Create the transaction and associate it with the user's default account
    const transaction = await db.transaction.create({
      data: {
        amount,
        description,
        date: new Date(date),
        category,
        userId: profile.id,
        paymentMode, // Use the provided payment mode or default to UPI
        type,
        accountId: defaultAccount.id,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("[TRANSACTION_POST]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    const profile = await currentProfile();
    if (!userId) {
      console.error("[TRANSACTIONS_GET] Unauthorized access attempt.");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const transactions = await db.transaction.findMany({
      where: { userId: profile?.id },
      orderBy: { date: "desc" },
      take: 10,
      select: {
        id: true,
        amount: true,
        type: true,
        paymentMode: true,
        date: true,
        category: true,
      },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("[TRANSACTIONS_GET] Internal Error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
