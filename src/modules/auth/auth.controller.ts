import type { Request, Response, NextFunction } from "express";
import { ok } from "../../utils/apiResponse";
import * as service from "./auth.service";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password, name } = req.body;
    const result = await service.register(email, password, name);
    return res.status(201).json(ok("Registered", result));
  } catch (e) {
    next(e);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const result = await service.login(email, password);
    return res.json(ok("Logged in", result));
  } catch (e) {
    next(e);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    const result = await service.refresh(refreshToken);
    return res.json(ok("Refreshed", result));
  } catch (e) {
    next(e);
  }
}
