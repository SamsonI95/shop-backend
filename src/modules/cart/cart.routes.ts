import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { validateBody } from "../../middlewares/validate";
import { addToCartSchema, updateCartItemSchema } from "./cart.schemas";
import * as controller from "./cart.controller";

export const cartRoutes = Router();

/**
 * @openapi
 * /cart:
 *   get:
 *     summary: Get my cart
 *     description: Return the authenticated user's cart.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart
 */
cartRoutes.get("/", requireAuth, controller.getMyCart);
/**
 * @openapi
 * /cart/items:
 *   post:
 *     summary: Add item to cart
 *     description: Add a product to the authenticated user's cart.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, quantity]
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Added
 */
cartRoutes.post("/items", requireAuth, validateBody(addToCartSchema), controller.addToCart);
/**
 * @openapi
 * /cart/items:
 *   patch:
 *     summary: Update cart item
 *     description: Update quantity for a product in the authenticated user's cart.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, quantity]
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Updated
 */
cartRoutes.patch("/items", requireAuth, validateBody(updateCartItemSchema), controller.updateCartItem);
/**
 * @openapi
 * /cart/items/{productId}:
 *   delete:
 *     summary: Remove cart item
 *     description: Remove a product from the authenticated user's cart.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Removed
 */
cartRoutes.delete("/items/:productId", requireAuth, controller.removeFromCart);
