"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.createProductSchema = exports.listProductsQuery = void 0;
const zod_1 = require("zod");
exports.listProductsQuery = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
    q: zod_1.z.string().optional()
});
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(200),
    description: zod_1.z.string().max(2000).optional(),
    priceKobo: zod_1.z.number().int().min(0),
    currency: zod_1.z.string().default("NGN"),
    imageUrl: zod_1.z.string().url().optional(),
    stock: zod_1.z.number().int().min(0).default(0),
    isActive: zod_1.z.boolean().default(true)
});
exports.updateProductSchema = exports.createProductSchema.partial();
