import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { validateBody } from "../../middlewares/validate";
import { initPaymentSchema } from "./payments.schemas";
import * as controller from "./payments.controller";

export function paymentsRoutes(opts?: { rawBody?: boolean }) {
  const r = Router();

  // Webhook must use raw-body parser
  if (opts?.rawBody) {
    /**
     * @openapi
     * /payments/webhook/paystack:
     *   post:
     *     summary: Paystack webhook
     *     description: Receive Paystack webhook events.
     *     tags: [Payments]
     *     responses:
     *       200:
     *         description: Webhook received
     */
    r.post("/webhook/paystack", controller.rawBodyJson, controller.webhook);
  }

  /**
   * @openapi
   * /payments/init:
   *   post:
   *     summary: Initialize payment
   *     description: Start a payment for an order.
   *     tags: [Payments]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [orderId]
   *             properties:
   *               orderId:
   *                 type: string
   *     responses:
   *       200:
   *         description: Payment initialized
   */
  r.post(
    "/init",
    requireAuth,
    validateBody(initPaymentSchema),
    controller.init,
  );

  return r;
}
