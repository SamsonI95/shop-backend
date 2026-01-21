import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/db";
import { ok } from "../../utils/apiResponse";

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    });
    return res.json(ok("Me", user));
  } catch (e) {
    next(e);
  }
}

export async function updateMe(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name: req.body.name },
      select: { id: true, email: true, name: true, role: true }
    });
    return res.json(ok("Updated", user));
  } catch (e) {
    next(e);
  }
}
