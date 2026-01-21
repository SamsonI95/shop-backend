import { Router } from "express";
import * as controller from "./health.controller";

export const healthRoutes = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 */
healthRoutes.get("/", controller.health);
