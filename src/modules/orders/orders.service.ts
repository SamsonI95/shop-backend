import { prisma } from "../../config/db";
import { AppError } from "../../middlewares/error";
import { randomRef } from "../../utils/crypto";
import { clearCart, getCart } from "../cart/cart.service";

export async function createFromCart(userId: string) {
  const { cart, totalKobo, currency } = await getCart(userId);

  if (cart.items.length === 0) throw new AppError("Cart is empty", 400);

  // Stock check and snapshot pricing
  for (const item of cart.items) {
    if (!item.product.isActive)
      throw new AppError("Inactive product in cart", 400);
    if (item.product.stock < item.quantity)
      throw new AppError(`Insufficient stock for ${item.product.name}`, 400);
  }

  const reference = randomRef("order");

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId,
        totalKobo,
        currency,
        reference,
        items: {
          create: cart.items.map(
            (it: {
              productId: string;
              quantity: number;
              product: { priceKobo: number };
            }) => ({
              productId: it.productId,
              quantity: it.quantity,
              unitKobo: it.product.priceKobo,
            }),
          ),
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

export async function listMyOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } }, payment: true },
  });
}

export async function getMyOrder(userId: string, orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: { include: { product: true } }, payment: true },
  });
  if (!order) throw new AppError("Not found", 404);
  return order;
}
