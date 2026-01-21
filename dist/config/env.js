"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(["development", "test", "production"])
        .default("development"),
    PORT: zod_1.z.coerce.number().default(4000),
    APP_URL: zod_1.z.string().url().default("http://localhost:4000"),
    DATABASE_URL: zod_1.z.string().min(1),
    CORS_ORIGIN: zod_1.z.string().min(1),
    JWT_ACCESS_SECRET: zod_1.z.string().min(20),
    JWT_REFRESH_SECRET: zod_1.z.string().min(20),
    JWT_ACCESS_EXPIRES_IN: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]).default("15m"),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]).default("30d"),
    ADMIN_API_KEY: zod_1.z.string().optional(),
    PAYSTACK_SECRET_KEY: zod_1.z.string().min(1),
    PAYSTACK_PUBLIC_KEY: zod_1.z.string().min(1),
    PAYSTACK_WEBHOOK_SECRET: zod_1.z.string().min(1),
    RESEND_API_KEY: zod_1.z.string().optional(),
    EMAIL_FROM: zod_1.z.string().optional(),
    R2_ACCOUNT_ID: zod_1.z.string().optional(),
    R2_ACCESS_KEY_ID: zod_1.z.string().optional(),
    R2_SECRET_ACCESS_KEY: zod_1.z.string().optional(),
    R2_BUCKET: zod_1.z.string().optional(),
    R2_PUBLIC_BASE_URL: zod_1.z.string().optional(),
});
exports.env = envSchema.parse(process.env);
