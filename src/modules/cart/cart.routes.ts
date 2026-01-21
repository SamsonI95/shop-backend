import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { validateBody } from "../../middlewares/validate";
import { addToCartSchema, updateCartItemSchema } from "./cart.schemas";
import * as controller from "./cart.controller";

export const cartRoutes = Router();

cartRoutes.get("/", requireAuth, controller.getMyCart);
cartRoutes.post("/items", requireAuth, validateBody(addToCartSchema), controller.addToCart);
cartRoutes.patch("/items", requireAuth, validateBody(updateCartItemSchema), controller.updateCartItem);
cartRoutes.delete("/items/:productId", requireAuth, controller.removeFromCart);