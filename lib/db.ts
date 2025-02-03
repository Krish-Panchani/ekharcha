import { PrismaClient } from "@prisma/client";

declare global {
  namespace NodeJS {
    var prisma: PrismaClient | undefined;
  }
}

export const db: PrismaClient =
  (globalThis as any).prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
    errorFormat: process.env.NODE_ENV === "development" ? "pretty" : "minimal",
  });

if (process.env.NODE_ENV !== "production") (globalThis as any).prisma = db;
