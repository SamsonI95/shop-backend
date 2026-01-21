import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { validateBody } from "../../middlewares/validate";
import { updateMeSchema } from "./users.schemas";
import * as controller from "./users.controller";

export const usersRoutes = Router();

usersRoutes.get("/me", requireAuth, controller.me);
usersRoutes.patch(
  "/me",
  requireAuth,
  validateBody(updateMeSchema),
  controller.updateMe,
);
