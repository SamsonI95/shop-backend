import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { AppError } from "./error";

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return next(
        new AppError("Validation error", 422, parsed.error.flatten()),
      );
    }
    (res.locals as any).body = parsed.data;
    return next();
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      return next(
        new AppError("Validation error", 422, parsed.error.flatten()),
      );
    }
    (res.locals as any).query = parsed.data;
    return next();
  };
}
