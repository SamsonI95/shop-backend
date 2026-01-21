"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const pino_http_1 = __importDefault(require("pino-http"));
const env_1 = require("./config/env");
const logger_1 = require("./config/logger");
const rateLimit_1 = require("./middlewares/rateLimit");
const error_1 = require("./middlewares/error");
const health_routes_1 = require("./modules/health/health.routes");
const auth_routes_1 = require("./modules/auth/auth.routes");
const users_routes_1 = require("./modules/users/users.routes");
const products_routes_1 = require("./modules/products/products.routes");
const cart_routes_1 = require("./modules/cart/cart.routes");
const orders_routes_1 = require("./modules/orders/orders.routes");
const payments_routes_1 = require("./modules/payments/payments.routes");
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, pino_http_1.default)({ logger: logger_1.logger }));
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: env_1.env.CORS_ORIGIN.split(",").map((s) => s.trim()),
        credentials: true,
    }));
    app.use("/payments", (0, payments_routes_1.paymentsRoutes)({ rawBody: true }));
    app.use(express_1.default.json({ limit: "1mb" }));
    app.use(rateLimit_1.apiRateLimit);
    app.use("/health", health_routes_1.healthRoutes);
    app.use("/auth", auth_routes_1.authRoutes);
    app.use("/users", users_routes_1.usersRoutes);
    app.use("/products", products_routes_1.productsRoutes);
    app.use("/cart", cart_routes_1.cartRoutes);
    app.use("/orders", orders_routes_1.ordersRoutes);
    app.use(error_1.notFound);
    app.use(error_1.errorHandler);
    return app;
}
