import { Router } from "express";
import { authRateLimit } from "../../middlewares/rateLimit";
import { validateBody } from "../../middlewares/validate";
import * as controller from "./auth.controller";
import { loginSchema, refreshSchema, registerSchema } from "./auth.schemas";

export const authRoutes = Router();

authRoutes.post(
  "/register",
  authRateLimit,
  validateBody(registerSchema),
  controller.register,
);
authRoutes.post(
  "/login",
  authRateLimit,
  validateBody(loginSchema),
  controller.login,
);
authRoutes.post(
  "/refresh",
  authRateLimit,
  validateBody(refreshSchema),
  controller.refresh,
);
