import type { Request, Response, NextFunction } from "express";
import express from "express";
import { ok, fail } from "../../utils/apiResponse";
import { AppError } from "../../middlewares/error";
import { env } from "../../config/env";
import { hmacSha512Hex } from "../../utils/crypto";
import * as service from "./payments.service";

export async function init(req: Request, res: Response, next: NextFunction) {
  try {
    const { orderId } = req.body;
    const result = await service.initPayment(req.user!.userId, orderId);
    return res.json(ok("Payment initialized", result));
  } catch (e) {
    next(e);
  }
}

// Paystack webhook handler
export async function webhook(req: Request, res: Response, next: NextFunction) {
  try {
    const signature = req.headers["x-paystack-signature"];
    if (typeof signature !== "string") throw new AppError("Missing signature", 400);

    const rawBody = (req as any).rawBody as string;
    if (!rawBody) throw new AppError("Missing raw body", 400);

    const expected = hmacSha512Hex(rawBody, env.PAYSTACK_WEBHOOK_SECRET);
    if (expected !== signature) throw new AppError("Invalid signature", 401);

    const event = req.body;
    const eventType = event?.event;
    const reference = event?.data?.reference;

    if (!reference) throw new AppError("Missing reference", 400);

    // Only process charge.success for MVP
    if (eventType === "charge.success") {
      await service.handleVerifiedPayment(reference, event);
    }

    return res.json(ok("Webhook received"));
  } catch (e) {
    next(e);
  }
}

// raw-body middleware for webhook only
export function rawBodyJson(req: Request, res: Response, next: NextFunction) {
  const chunks: Buffer[] = [];
  req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
  req.on("end", () => {
    const raw = Buffer.concat(chunks).toString("utf8");
    (req as any).rawBody = raw;
    try {
      req.body = raw ? JSON.parse(raw) : {};
    } catch {
      return res.status(400).json(fail("Invalid JSON"));
    }
    next();
  });
  req.on("error", () => res.status(400).json(fail("Bad request")));
}
