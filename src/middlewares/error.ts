import type { NextFunction, Request, Response } from "express";
import { fail } from "../utils/apiResponse";
import { logger } from "../config/logger";

export class AppError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode = 400, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function notFound(req: Request, res: Response) {
  return res
    .status(404)
    .json(fail(`Route not found: ${req.method} ${req.path}`));
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json(fail(err.message, { details: err.details }));
  }

  logger.error({ err }, "Unhandled error");

  if (process.env.NODE_ENV !== "production") {
    const e = err instanceof Error ? err : new Error(String(err));
    return res.status(500).json(
      fail("Internal server error", {
        name: e.name,
        message: e.message,
        stack: e.stack,
      }),
    );
  }

  return res.status(500).json(fail("Internal server error"));
}
