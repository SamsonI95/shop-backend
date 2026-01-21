import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import { prisma } from "../../config/db";
import { env } from "../../config/env";
import { AppError } from "../../middlewares/error";

function signAccessToken(userId: string, role: "USER" | "ADMIN") {
  const opts: SignOptions = { expiresIn: env.JWT_ACCESS_EXPIRES_IN as any };
  return jwt.sign({ userId, role }, env.JWT_ACCESS_SECRET, opts);
}

function signRefreshToken(userId: string, role: "USER" | "ADMIN") {
  const opts: SignOptions = { expiresIn: env.JWT_REFRESH_EXPIRES_IN as any };
  return jwt.sign({ userId, role }, env.JWT_REFRESH_SECRET, opts);
}

export async function register(email: string, password: string, name?: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError("Email already in use", 409);

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, passwordHash, name },
  });

  // create cart
  await prisma.cart.create({ data: { userId: user.id } });

  const accessToken = signAccessToken(user.id, user.role);
  const refreshToken = signRefreshToken(user.id, user.role);

  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    accessToken,
    refreshToken,
  };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError("Invalid credentials", 401);

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new AppError("Invalid credentials", 401);

  const accessToken = signAccessToken(user.id, user.role);
  const refreshToken = signRefreshToken(user.id, user.role);

  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    accessToken,
    refreshToken,
  };
}

export async function refresh(refreshToken: string) {
  try {
    const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
      userId: string;
      role: "USER" | "ADMIN";
    };
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) throw new AppError("Unauthorized", 401);

    return {
      accessToken: signAccessToken(user.id, user.role),
      refreshToken: signRefreshToken(user.id, user.role),
    };
  } catch {
    throw new AppError("Unauthorized", 401);
  }
}
