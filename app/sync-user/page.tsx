import { db } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
// import { CategoryType } from "@prisma/client";
import { notFound, redirect } from "next/navigation";

const SyncUser = async () => {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("User not found");
    }

    const client = await clerkClient();

    const user = await client.users.getUser(userId);

    if (!user.emailAddresses[0]?.emailAddress) {
        return notFound();
    }

    // Upsert user into the database
    // const createdUser = 
    await db.user.upsert({
        where: {
            emailAddress: user.emailAddresses[0]?.emailAddress ?? "",
        },
        update: {
            imageUrl: user.imageUrl,
            firstName: user.firstName,
            lastName: user.lastName,
        },
        create: {
            id: user.id,
            emailAddress: user.emailAddresses[0]?.emailAddress ?? "",
            imageUrl: user.imageUrl,
            firstName: user.firstName,
            lastName: user.lastName,
        },
    });

    // Add default categories for the user
    // const defaultCategories = [
    //     { name: 'Food & Dining', type: CategoryType.EXPENSE, userId: createdUser.id },
    //     { name: 'Petrol', type: CategoryType.EXPENSE, userId: createdUser.id },
    //     { name: 'Recharge & Bills', type: CategoryType.EXPENSE, userId: createdUser.id },
    //     { name: 'Traveling', type: CategoryType.EXPENSE, userId: createdUser.id },
    //     { name: 'Gift', type: CategoryType.EXPENSE, userId: createdUser.id },
    //     { name: 'Salary', type: CategoryType.INCOME, userId: createdUser.id },
    //     { name: 'Friend', type: CategoryType.INCOME, userId: createdUser.id },
    //     { name: 'Bonuses', type: CategoryType.INCOME, userId: createdUser.id },
    //     { name: 'Gift', type: CategoryType.INCOME, userId: createdUser.id },
    // ];

    // // Create the default categories in the database
    // await db.category.createMany({
    //     data: defaultCategories,
    // });

    return redirect("/dashboard");
};

export default SyncUser;
