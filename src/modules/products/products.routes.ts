import { Router } from "express";
import { requireAuth, requireAdminOrApiKey } from "../../middlewares/auth";
import { validateBody, validateQuery } from "../../middlewares/validate";
import { createProductSchema, listProductsQuery, updateProductSchema } from "./products.schemas";
import * as controller from "./products.controller";

export const productsRoutes = Router();

productsRoutes.get("/", validateQuery(listProductsQuery), controller.list);
productsRoutes.get("/:id", controller.getOne);

// Admin writes (either logged in admin OR x-admin-key header)
productsRoutes.post("/", requireAuth, requireAdminOrApiKey, validateBody(createProductSchema), controller.create);
productsRoutes.patch("/:id", requireAuth, requireAdminOrApiKey, validateBody(updateProductSchema), controller.update);
productsRoutes.delete("/:id", requireAuth, requireAdminOrApiKey, controller.remove);
