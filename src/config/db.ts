import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";

export const prisma = new PrismaClient();

export async function connectDb() {
  try {
    await prisma.$connect();
    logger.info("Database connected");
  } catch (err) {
    logger.error({ err }, "Database connection failed");
    throw err;
  }
}
