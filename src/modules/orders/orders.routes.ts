import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import * as controller from "./orders.controller";

export const ordersRoutes = Router();

ordersRoutes.post("/", requireAuth, controller.create);
ordersRoutes.get("/", requireAuth, controller.listMine);
ordersRoutes.get("/:id", requireAuth, controller.getMine);
