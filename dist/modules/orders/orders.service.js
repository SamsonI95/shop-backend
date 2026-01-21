"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFromCart = createFromCart;
exports.listMyOrders = listMyOrders;
exports.getMyOrder = getMyOrder;
const db_1 = require("../../config/db");
const error_1 = require("../../middlewares/error");
const crypto_1 = require("../../utils/crypto");
const cart_service_1 = require("../cart/cart.service");
async function createFromCart(userId) {
    const { cart, totalKobo, currency } = await (0, cart_service_1.getCart)(userId);
    if (cart.items.length === 0)
        throw new error_1.AppError("Cart is empty", 400);
    // Stock check and snapshot pricing
    for (const item of cart.items) {
        if (!item.product.isActive)
            throw new error_1.AppError("Inactive product in cart", 400);
        if (item.product.stock < item.quantity)
            throw new error_1.AppError(`Insufficient stock for ${item.product.name}`, 400);
    }
    const reference = (0, crypto_1.randomRef)("order");
    const order = await db_1.prisma.$transaction(async (tx) => {
        const created = await tx.order.create({
            data: {
                userId,
                totalKobo,
                currency,
                reference,
                items: {
                    create: cart.items.map((it) => ({
                        productId: it.productId,
                        quantity: it.quantity,
                        unitKobo: it.product.priceKobo,
                    })),
                },
            },
            include: { items: true },
        });
        // Reserve stock immediately (simple MVP approach)
        for (const item of cart.items) {
            await tx.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } },
            });
        }
        await tx.payment.create({
            data: {
                orderId: created.id,
                reference,
                amountKobo: totalKobo,
                currency,
            },
        });
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        return created;
    });
    return order;
}
async function listMyOrders(userId) {
    return db_1.prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: { items: { include: { product: true } }, payment: true },
    });
}
async function getMyOrder(userId, orderId) {
    const order = await db_1.prisma.order.findFirst({
        where: { id: orderId, userId },
        include: { items: { include: { product: true } }, payment: true },
    });
    if (!order)
        throw new error_1.AppError("Not found", 404);
    return order;
}
