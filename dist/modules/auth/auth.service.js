"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.refresh = refresh;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../../config/db");
const env_1 = require("../../config/env");
const error_1 = require("../../middlewares/error");
function signAccessToken(userId, role) {
    const opts = { expiresIn: env_1.env.JWT_ACCESS_EXPIRES_IN };
    return jsonwebtoken_1.default.sign({ userId, role }, env_1.env.JWT_ACCESS_SECRET, opts);
}
function signRefreshToken(userId, role) {
    const opts = { expiresIn: env_1.env.JWT_REFRESH_EXPIRES_IN };
    return jsonwebtoken_1.default.sign({ userId, role }, env_1.env.JWT_REFRESH_SECRET, opts);
}
async function register(email, password, name) {
    const existing = await db_1.prisma.user.findUnique({ where: { email } });
    if (existing)
        throw new error_1.AppError("Email already in use", 409);
    const passwordHash = await bcrypt_1.default.hash(password, 12);
    const user = await db_1.prisma.user.create({
        data: { email, passwordHash, name },
    });
    // create cart
    await db_1.prisma.cart.create({ data: { userId: user.id } });
    const accessToken = signAccessToken(user.id, user.role);
    const refreshToken = signRefreshToken(user.id, user.role);
    return {
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        accessToken,
        refreshToken,
    };
}
async function login(email, password) {
    const user = await db_1.prisma.user.findUnique({ where: { email } });
    if (!user)
        throw new error_1.AppError("Invalid credentials", 401);
    const ok = await bcrypt_1.default.compare(password, user.passwordHash);
    if (!ok)
        throw new error_1.AppError("Invalid credentials", 401);
    const accessToken = signAccessToken(user.id, user.role);
    const refreshToken = signRefreshToken(user.id, user.role);
    return {
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
        accessToken,
        refreshToken,
    };
}
async function refresh(refreshToken) {
    try {
        const payload = jsonwebtoken_1.default.verify(refreshToken, env_1.env.JWT_REFRESH_SECRET);
        const user = await db_1.prisma.user.findUnique({
            where: { id: payload.userId },
        });
        if (!user)
            throw new error_1.AppError("Unauthorized", 401);
        return {
            accessToken: signAccessToken(user.id, user.role),
            refreshToken: signRefreshToken(user.id, user.role),
        };
    }
    catch {
        throw new error_1.AppError("Unauthorized", 401);
    }
}
