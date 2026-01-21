"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCart = getCart;
exports.addItem = addItem;
exports.updateItem = updateItem;
exports.removeItem = removeItem;
exports.clearCart = clearCart;
const db_1 = require("../../config/db");
const error_1 = require("../../middlewares/error");
async function getCart(userId) {
    const cart = await db_1.prisma.cart.findUnique({
        where: { userId },
        include: { items: { include: { product: true } } }
    });
    if (!cart)
        throw new error_1.AppError("Cart not found", 404);
    const totalKobo = cart.items.reduce((sum, it) => sum + it.quantity * it.product.priceKobo, 0);
    return { cart, totalKobo, currency: "NGN" };
}
async function addItem(userId, productId, quantity) {
    const product = await db_1.prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.isActive)
        throw new error_1.AppError("Product not found", 404);
    if (product.stock < quantity)
        throw new error_1.AppError("Insufficient stock", 400);
    const cart = await db_1.prisma.cart.upsert({
        where: { userId },
        create: { userId },
        update: {}
    });
    await db_1.prisma.cartItem.upsert({
        where: { cartId_productId: { cartId: cart.id, productId } },
        create: { cartId: cart.id, productId, quantity },
        update: { quantity: { increment: quantity } }
    });
    return getCart(userId);
}
async function updateItem(userId, productId, quantity) {
    const cart = await db_1.prisma.cart.findUnique({ where: { userId } });
    if (!cart)
        throw new error_1.AppError("Cart not found", 404);
    const product = await db_1.prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.isActive)
        throw new error_1.AppError("Product not found", 404);
    if (product.stock < quantity)
        throw new error_1.AppError("Insufficient stock", 400);
    await db_1.prisma.cartItem.update({
        where: { cartId_productId: { cartId: cart.id, productId } },
        data: { quantity }
    });
    return getCart(userId);
}
async function removeItem(userId, productId) {
    const cart = await db_1.prisma.cart.findUnique({ where: { userId } });
    if (!cart)
        throw new error_1.AppError("Cart not found", 404);
    await db_1.prisma.cartItem.delete({
        where: { cartId_productId: { cartId: cart.id, productId } }
    });
    return getCart(userId);
}
async function clearCart(userId) {
    const cart = await db_1.prisma.cart.findUnique({ where: { userId } });
    if (!cart)
        return;
    await db_1.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
}
