import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "./error";

export type AuthUser = { userId: string; role: "USER" | "ADMIN" };

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return next(new AppError("Unauthorized", 401));
  const token = header.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthUser;
    req.user = payload;
    next();
  } catch {
    next(new AppError("Unauthorized", 401));
  }
}

export function requireAdminOrApiKey(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const apiKey = req.headers["x-admin-key"];
  if (env.ADMIN_API_KEY && apiKey === env.ADMIN_API_KEY) return next();

  if (!req.user) return next(new AppError("Unauthorized", 401));
  if (req.user.role !== "ADMIN") return next(new AppError("Forbidden", 403));
  return next();
}
