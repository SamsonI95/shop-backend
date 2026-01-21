"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireAdminOrApiKey = requireAdminOrApiKey;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const error_1 = require("./error");
function requireAuth(req, _res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer "))
        return next(new error_1.AppError("Unauthorized", 401));
    const token = header.slice("Bearer ".length);
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_ACCESS_SECRET);
        req.user = payload;
        next();
    }
    catch {
        next(new error_1.AppError("Unauthorized", 401));
    }
}
function requireAdminOrApiKey(req, _res, next) {
    const apiKey = req.headers["x-admin-key"];
    if (env_1.env.ADMIN_API_KEY && apiKey === env_1.env.ADMIN_API_KEY)
        return next();
    if (!req.user)
        return next(new error_1.AppError("Unauthorized", 401));
    if (req.user.role !== "ADMIN")
        return next(new error_1.AppError("Forbidden", 403));
    return next();
}
