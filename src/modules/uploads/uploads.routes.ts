import { Router } from "express";
import { requireAuth, requireAdminOrApiKey } from "../../middlewares/auth";
import { validateBody } from "../../middlewares/validate";
import { presignUploadSchema } from "./uploads.schema";
import * as controller from "./uploads.controller";

export const uploadsRoutes = Router();

/**
 * @openapi
 * /uploads/product-image/presign:
 *   post:
 *     summary: Get a presigned URL to upload a product image to R2 (admin)
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *       - adminKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [filename, contentType]
 *             properties:
 *               filename: { type: string, example: "tee.png" }
 *               contentType: { type: string, example: "image/png" }
 *     responses:
 *       201:
 *         description: Presigned URL created
 */
uploadsRoutes.post(
  "/product-image/presign",
  requireAuth,
  requireAdminOrApiKey,
  validateBody(presignUploadSchema),
  controller.presignProductImage
);
