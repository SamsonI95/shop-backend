import { z } from "zod";

export const initPaymentSchema = z.object({
  orderId: z.string().min(1)
});
