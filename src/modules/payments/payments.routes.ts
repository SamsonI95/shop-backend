import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { validateBody } from "../../middlewares/validate";
import { initPaymentSchema } from "./payments.schemas";
import * as controller from "./payments.controller";

export function paymentsRoutes(opts?: { rawBody?: boolean }) {
  const r = Router();

  // Webhook must use raw-body parser
  if (opts?.rawBody) {
    r.post("/webhook/paystack", controller.rawBodyJson, controller.webhook);
  }

  r.post(
    "/init",
    requireAuth,
    validateBody(initPaymentSchema),
    controller.init,
  );

  return r;
}
