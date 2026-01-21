import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import * as controller from "./orders.controller";

export const ordersRoutes = Router();

/**
 * @openapi
 * /orders:
 *   post:
 *     summary: Create order
 *     description: Create an order from the authenticated user's cart.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Created
 */
ordersRoutes.post("/", requireAuth, controller.create);
/**
 * @openapi
 * /orders:
 *   get:
 *     summary: List my orders
 *     description: List orders for the authenticated user.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders list
 */
ordersRoutes.get("/", requireAuth, controller.listMine);
/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     summary: Get my order
 *     description: Get a single order for the authenticated user by id.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order
 */
ordersRoutes.get("/:id", requireAuth, controller.getMine);
