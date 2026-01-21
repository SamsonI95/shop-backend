"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = list;
const db_1 = require("../../config/db");
async function list(pageRaw, limitRaw, q) {
    const page = Math.max(parseInt(String(pageRaw ?? "1"), 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(String(limitRaw ?? "20"), 10) || 20, 1), 100);
    const skip = (page - 1) * limit;
    const where = q
        ? {
            isActive: true,
            OR: [
                { name: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } }
            ]
        }
        : { isActive: true };
    const [items, total] = await Promise.all([
        db_1.prisma.product.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
        db_1.prisma.product.count({ where })
    ]);
    return {
        items,
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
    };
}
