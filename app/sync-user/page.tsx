import { db } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { AccountType } from "@prisma/client"; // Importing AccountType enum from Prisma
import { notFound, redirect } from "next/navigation";

const SyncUser = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not found");
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  // Check if the user has a valid email address
  if (!user.emailAddresses[0]?.emailAddress) {
    return notFound();
  }

  // Upsert user into the database
  const createdUser = await db.user.upsert({
    where: {
      emailAddress: user.emailAddresses[0]?.emailAddress ?? "",
    },
    update: {
      clerkUserId: user.id, // Add the clerkUserId
      imageUrl: user.imageUrl,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    create: {
      emailAddress: user.emailAddresses[0]?.emailAddress ?? "",
      clerkUserId: user.id, // Add the clerkUserId
      imageUrl: user.imageUrl,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });

  // Create a default "Savings" account for the user
  await db.account.create({
    data: {
      name: "Default Savings Account", // Default account name
      type: AccountType.SAVINGS, // Set the type to "SAVINGS"
      userId: createdUser.id, // Link this account to the user
      isDefault: true, // Set this account as the default account
      balance: 0, // Initial balance set to 0
    },
  });

  // Redirect the user to the dashboard after syncing
  return redirect("/dashboard");
};

export default SyncUser;
