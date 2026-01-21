"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.notFound = notFound;
exports.errorHandler = errorHandler;
const apiResponse_1 = require("../utils/apiResponse");
const logger_1 = require("../config/logger");
class AppError extends Error {
    statusCode;
    details;
    constructor(message, statusCode = 400, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
}
exports.AppError = AppError;
function notFound(req, res) {
    return res
        .status(404)
        .json((0, apiResponse_1.fail)(`Route not found: ${req.method} ${req.path}`));
}
function errorHandler(err, _req, res, _next) {
    if (err instanceof AppError) {
        return res
            .status(err.statusCode)
            .json((0, apiResponse_1.fail)(err.message, { details: err.details }));
    }
    logger_1.logger.error({ err }, "Unhandled error");
    if (process.env.NODE_ENV !== "production") {
        const e = err instanceof Error ? err : new Error(String(err));
        return res.status(500).json((0, apiResponse_1.fail)("Internal server error", {
            name: e.name,
            message: e.message,
            stack: e.stack,
        }));
    }
    return res.status(500).json((0, apiResponse_1.fail)("Internal server error"));
}
