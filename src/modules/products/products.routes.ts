import { Router } from "express";
import { requireAuth, requireAdminOrApiKey } from "../../middlewares/auth";
import { validateBody, validateQuery } from "../../middlewares/validate";
import { createProductSchema, listProductsQuery, updateProductSchema } from "./products.schemas";
import * as controller from "./products.controller";

export const productsRoutes = Router();

/**
 * @openapi
 * /products:
 *   get:
 *     summary: List products
 *     description: List products with optional filtering and pagination.
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Products list
 */
productsRoutes.get("/", validateQuery(listProductsQuery), controller.list);
/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Get product
 *     description: Get a product by id.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product
 */
productsRoutes.get("/:id", controller.getOne);

// Admin writes (either logged in admin OR x-admin-key header)
/**
 * @openapi
 * /products:
 *   post:
 *     summary: Create product (admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *       - adminKey: []
 *     parameters:
 *       - in: header
 *         name: x-admin-key
 *         required: false
 *         schema:
 *           type: string
 *         description: Admin API key (required if user is not ADMIN)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, priceKobo, currency, stock]
 *             properties:
 *               name: { type: string, example: "Black Tee" }
 *               description: { type: string, example: "Soft cotton tee" }
 *               priceKobo: { type: integer, example: 120000 }
 *               currency: { type: string, example: "NGN" }
 *               stock: { type: integer, example: 10 }
 *               imageUrl: { type: string, example: "https://pub-xxx.r2.dev/products/black-tee.jpg" }
 *               isActive: { type: boolean, example: true }
 *     responses:
 *       201:
 *         description: Created
 */

productsRoutes.post("/", requireAuth, requireAdminOrApiKey, validateBody(createProductSchema), controller.create);
/**
 * @openapi
 * /products/{id}:
 *   patch:
 *     summary: Update product
 *     description: Update a product by id (admin only).
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated
 */
productsRoutes.patch("/:id", requireAuth, requireAdminOrApiKey, validateBody(updateProductSchema), controller.update);
/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: Delete product
 *     description: Delete a product by id (admin only).
 *     tags: [Products]
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
 *         description: Deleted
 */
productsRoutes.delete("/:id", requireAuth, requireAdminOrApiKey, controller.remove);
