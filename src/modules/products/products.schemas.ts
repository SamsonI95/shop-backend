import { z } from "zod";

export const listProductsQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().optional()
});

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  priceKobo: z.number().int().min(0),
  currency: z.string().default("NGN"),
  imageUrl: z.string().url().optional(),
  stock: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true)
});

export const updateProductSchema = createProductSchema.partial();
