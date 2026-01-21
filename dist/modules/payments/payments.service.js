"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPayment = initPayment;
exports.handleVerifiedPayment = handleVerifiedPayment;
const db_1 = require("../../config/db");
const error_1 = require("../../middlewares/error");
const env_1 = require("../../config/env");
const paystack_1 = require("./paystack");
async function initPayment(userId, orderId) {
    const order = await db_1.prisma.order.findFirst({
        where: { id: orderId, userId },
        include: { user: true, payment: true },
    });
    if (!order)
        throw new error_1.AppError("Order not found", 404);
    if (!order.payment)
        throw new error_1.AppError("Payment record missing", 500);
    if (order.status !== "PENDING")
        throw new error_1.AppError("Order not payable", 400);
    const init = await (0, paystack_1.paystackInitialize)(order.user.email, order.totalKobo, order.reference, env_1.env.APP_URL);
    await db_1.prisma.payment.update({
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
async function handleVerifiedPayment(reference, providerPayload) {
    // Idempotency: always check current state first
    const payment = await db_1.prisma.payment.findUnique({
        where: { reference },
        include: { order: true },
    });
    if (!payment)
        throw new error_1.AppError("Payment not found", 404);
    if (payment.status === "VERIFIED" && payment.order.status === "PAID") {
        return { alreadyProcessed: true };
    }
    // Verify with Paystack API (belt and suspenders)
    const verified = await (0, paystack_1.paystackVerify)(reference);
    const status = verified?.data?.status;
    const amount = verified?.data?.amount;
    if (status !== "success") {
        await db_1.prisma.payment.update({
            where: { reference },
            data: { status: "FAILED", providerData: providerPayload },
        });
        throw new error_1.AppError("Payment not successful", 400);
    }
    if (amount !== payment.amountKobo) {
        await db_1.prisma.payment.update({
            where: { reference },
            data: { status: "FAILED", providerData: providerPayload },
        });
        throw new error_1.AppError("Payment amount mismatch", 400);
    }
    await db_1.prisma.$transaction(async (tx) => {
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
