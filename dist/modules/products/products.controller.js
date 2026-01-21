"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = list;
exports.getOne = getOne;
exports.create = create;
exports.update = update;
exports.remove = remove;
const db_1 = require("../../config/db");
const apiResponse_1 = require("../../utils/apiResponse");
const service = __importStar(require("./products.service"));
const error_1 = require("../../middlewares/error");
async function list(req, res, next) {
    try {
        const { page, limit, q } = res.locals.query ?? req.query;
        const result = await service.list(page, limit, q);
        return res.json((0, apiResponse_1.ok)("Products", result.items, { pagination: result }));
    }
    catch (e) {
        next(e);
    }
}
async function getOne(req, res, next) {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const product = await db_1.prisma.product.findUnique({ where: { id } });
        if (!product || !product.isActive)
            throw new error_1.AppError("Not found", 404);
        return res.json((0, apiResponse_1.ok)("Product", product));
    }
    catch (e) {
        next(e);
    }
}
async function create(req, res, next) {
    try {
        const product = await db_1.prisma.product.create({ data: req.body });
        return res.status(201).json((0, apiResponse_1.ok)("Created", product));
    }
    catch (e) {
        next(e);
    }
}
async function update(req, res, next) {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const product = await db_1.prisma.product.update({
            where: { id },
            data: req.body,
        });
        return res.json((0, apiResponse_1.ok)("Updated", product));
    }
    catch (e) {
        next(e);
    }
}
async function remove(req, res, next) {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const product = await db_1.prisma.product.update({
            where: { id },
            data: { isActive: false },
        });
        return res.json((0, apiResponse_1.ok)("Archived", product));
    }
    catch (e) {
        next(e);
    }
}
