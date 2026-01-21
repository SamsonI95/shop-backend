import { prisma } from "../../config/db";
import { AppError } from "../../middlewares/error";
import { env } from "../../config/env";
import { paystackInitialize, paystackVerify } from "./paystack";

export async function initPayment(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { user: true, payment: true },
  });

  if (!order) throw new AppError("Order not found", 404);
  if (!order.payment) throw new AppError("Payment record missing", 500);
  if (order.status !== "PENDING") throw new AppError("Order not payable", 400);

  const init = await paystackInitialize(
    order.user.email,
    order.totalKobo,
    order.reference,
    env.APP_URL,
  );

  await prisma.payment.update({
    where: { id: order.payment.id },
    data: {
      status: "INITIATED",
      providerData: init,
    },
  });

  return {
    authorizationUrl: init.data.authorization_url,
    reference: order.reference,
  };
}

export async function handleVerifiedPayment(
  reference: string,
  providerPayload: any,
) {
  // Idempotency: always check current state first
  const payment = await prisma.payment.findUnique({
    where: { reference },
    include: { order: true },
  });
  if (!payment) throw new AppError("Payment not found", 404);

  if (payment.status === "VERIFIED" && payment.order.status === "PAID") {
    return { alreadyProcessed: true };
  }

  // Verify with Paystack API (belt and suspenders)
  const verified = await paystackVerify(reference);

  const status = verified?.data?.status;
  const amount = verified?.data?.amount;

  if (status !== "success") {
    await prisma.payment.update({
      where: { reference },
      data: { status: "FAILED", providerData: providerPayload },
    });
    throw new AppError("Payment not successful", 400);
  }

  if (amount !== payment.amountKobo) {
    await prisma.payment.update({
      where: { reference },
      data: { status: "FAILED", providerData: providerPayload },
    });
    throw new AppError("Payment amount mismatch", 400);
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { reference },
      data: {
        status: "VERIFIED",
        verifiedAt: new Date(),
        providerData: providerPayload,
      },
    });

    await tx.order.update({
      where: { id: payment.orderId },
      data: { status: "PAID" },
    });
  });

  return { ok: true };
}
