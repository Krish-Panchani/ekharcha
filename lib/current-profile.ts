// src/lib/current-profile.ts
import { auth } from "@clerk/nextjs/server";
import { db } from "./db";

export const currentProfile = async () => {
  try {
    const { userId } = await auth();

    if (!userId) return null;

    const profile = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    return profile || null;
  } catch (error) {
    console.error("[PROFILE_FETCH_ERROR]", error);
    return null;
  }
};
