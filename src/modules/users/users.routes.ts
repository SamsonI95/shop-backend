import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { validateBody } from "../../middlewares/validate";
import { updateMeSchema } from "./users.schemas";
import * as controller from "./users.controller";

export const usersRoutes = Router();

/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: Get current user
 *     description: Return the profile for the authenticated user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user
 */
usersRoutes.get("/me", requireAuth, controller.me);
/**
 * @openapi
 * /users/me:
 *   patch:
 *     summary: Update current user
 *     description: Update the authenticated user's profile.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Updated
 */
usersRoutes.patch(
  "/me",
  requireAuth,
  validateBody(updateMeSchema),
  controller.updateMe,
);
