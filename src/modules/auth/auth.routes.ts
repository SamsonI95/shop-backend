import { Router } from "express";
import { authRateLimit } from "../../middlewares/rateLimit";
import { validateBody } from "../../middlewares/validate";
import * as controller from "./auth.controller";
import { loginSchema, refreshSchema, registerSchema } from "./auth.schemas";

export const authRoutes = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register user
 *     description: Create a user account and return access/refresh tokens.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registered
 */
authRoutes.post(
  "/register",
  authRateLimit,
  validateBody(registerSchema),
  controller.register,
);
/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Verify credentials and return access/refresh tokens.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Logged in
 */
authRoutes.post(
  "/login",
  authRateLimit,
  validateBody(loginSchema),
  controller.login,
);
/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Refresh tokens
 *     description: Exchange a refresh token for new tokens.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tokens refreshed
 */
authRoutes.post(
  "/refresh",
  authRateLimit,
  validateBody(refreshSchema),
  controller.refresh,
);
