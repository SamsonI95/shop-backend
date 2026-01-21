import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { apiRateLimit } from "./middlewares/rateLimit";
import { errorHandler, notFound } from "./middlewares/error";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

import { healthRoutes } from "./modules/health/health.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { usersRoutes } from "./modules/users/users.routes";
import { productsRoutes } from "./modules/products/products.routes";
import { cartRoutes } from "./modules/cart/cart.routes";
import { ordersRoutes } from "./modules/orders/orders.routes";
import { paymentsRoutes } from "./modules/payments/payments.routes";

export function createApp() {
  const app = express();

  app.use(express.json({ limit: "1mb" }));
  app.use(apiRateLimit);

  app.use(pinoHttp({ logger }));

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(",").map((s) => s.trim()),
      credentials: true,
    }),
  );

  app.use("/payments", paymentsRoutes({ rawBody: true }));

  app.get("/docs.json", (_req, res) => res.json(swaggerSpec));
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, { explorer: true }),
  );

  app.use("/health", healthRoutes);
  app.use("/auth", authRoutes);
  app.use("/users", usersRoutes);
  app.use("/products", productsRoutes);
  app.use("/cart", cartRoutes);
  app.use("/orders", ordersRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
