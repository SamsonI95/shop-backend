"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
exports.validateQuery = validateQuery;
const error_1 = require("./error");
function validateBody(schema) {
    return (req, res, next) => {
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) {
            return next(new error_1.AppError("Validation error", 422, parsed.error.flatten()));
        }
        res.locals.body = parsed.data;
        return next();
    };
}
function validateQuery(schema) {
    return (req, res, next) => {
        const parsed = schema.safeParse(req.query);
        if (!parsed.success) {
            return next(new error_1.AppError("Validation error", 422, parsed.error.flatten()));
        }
        res.locals.query = parsed.data;
        return next();
    };
}
