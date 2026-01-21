import type { Request, Response, NextFunction } from "express";
import { ok } from "../../utils/apiResponse";
import * as service from "./cart.service";

export async function getMyCart(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const result = await service.getCart(userId);
    return res.json(ok("Cart", result));
  } catch (e) {
    next(e);
  }
}

export async function addToCart(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const { productId, quantity } = req.body;
    const result = await service.addItem(userId, productId, quantity);
    return res.json(ok("Added", result));
  } catch (e) {
    next(e);
  }
}

export async function updateCartItem(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const { productId, quantity } = req.body;
    const result = await service.updateItem(userId, productId, quantity);
    return res.json(ok("Updated", result));
  } catch (e) {
    next(e);
  }
}

export async function removeFromCart(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const productId = req.params.productId as string;
    const result = await service.removeItem(userId, productId);
    return res.json(ok("Removed", result));
  } catch (e) {
    next(e);
  }
}
