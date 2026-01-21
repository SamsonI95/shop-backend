import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/db";
import { ok } from "../../utils/apiResponse";
import * as service from "./products.service";
import { AppError } from "../../middlewares/error";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit, q } = (res.locals as any).query ?? req.query;
    const result = await service.list(page, limit, q);
    return res.json(ok("Products", result.items, { pagination: result }));
  } catch (e) {
    next(e);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product || !product.isActive) throw new AppError("Not found", 404);
    return res.json(ok("Product", product));
  } catch (e) {
    next(e);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await prisma.product.create({ data: req.body });
    return res.status(201).json(ok("Created", product));
  } catch (e) {
    next(e);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const product = await prisma.product.update({
      where: { id },
      data: req.body,
    });
    return res.json(ok("Updated", product));
  } catch (e) {
    next(e);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const product = await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
    return res.json(ok("Archived", product));
  } catch (e) {
    next(e);
  }
}
