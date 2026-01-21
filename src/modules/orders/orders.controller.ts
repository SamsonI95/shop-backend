import type { Request, Response, NextFunction } from "express";
import { ok } from "../../utils/apiResponse";
import * as service from "./orders.service";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await service.createFromCart(req.user!.userId);
    return res.status(201).json(ok("Order created", order));
  } catch (e) {
    next(e);
  }
}

export async function listMine(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const orders = await service.listMyOrders(req.user!.userId);
    return res.json(ok("Orders", orders));
  } catch (e) {
    next(e);
  }
}

export async function getMine(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const order = await service.getMyOrder(req.user!.userId, id);
    return res.json(ok("Order", order));
  } catch (e) {
    next(e);
  }
}
