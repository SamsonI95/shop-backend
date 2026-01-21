import { prisma } from "../../config/db";
import { AppError } from "../../middlewares/error";

export async function getCart(userId: string) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } }
  });
  if (!cart) throw new AppError("Cart not found", 404);

  const totalKobo = cart.items.reduce(
    (sum: number, it: { quantity: number; product: { priceKobo: number } }) =>
      sum + it.quantity * it.product.priceKobo,
    0
  );

  return { cart, totalKobo, currency: "NGN" };
}

export async function addItem(userId: string, productId: string, quantity: number) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) throw new AppError("Product not found", 404);
  if (product.stock < quantity) throw new AppError("Insufficient stock", 400);

  const cart = await prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {}
  });

  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    create: { cartId: cart.id, productId, quantity },
    update: { quantity: { increment: quantity } }
  });

  return getCart(userId);
}

export async function updateItem(userId: string, productId: string, quantity: number) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new AppError("Cart not found", 404);

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) throw new AppError("Product not found", 404);
  if (product.stock < quantity) throw new AppError("Insufficient stock", 400);

  await prisma.cartItem.update({
    where: { cartId_productId: { cartId: cart.id, productId } },
    data: { quantity }
  });

  return getCart(userId);
}

export async function removeItem(userId: string, productId: string) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new AppError("Cart not found", 404);

  await prisma.cartItem.delete({
    where: { cartId_productId: { cartId: cart.id, productId } }
  });

  return getCart(userId);
}

export async function clearCart(userId: string) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return;

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
}
