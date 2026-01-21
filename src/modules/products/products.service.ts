import { prisma } from "../../config/db";

export async function list(pageRaw?: any, limitRaw?: any, q?: string) {
  const page = Math.max(parseInt(String(pageRaw ?? "1"), 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(String(limitRaw ?? "20"), 10) || 20, 1), 100);
  const skip = (page - 1) * limit;

  const where = q
    ? {
        isActive: true,
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { description: { contains: q, mode: "insensitive" as const } }
        ]
      }
    : { isActive: true };

  const [items, total] = await Promise.all([
    prisma.product.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
    prisma.product.count({ where })
  ]);

  return {
    items,
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  };
}
