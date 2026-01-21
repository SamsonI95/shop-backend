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
exports.create = create;
exports.listMine = listMine;
exports.getMine = getMine;
const apiResponse_1 = require("../../utils/apiResponse");
const service = __importStar(require("./orders.service"));
async function create(req, res, next) {
    try {
        const order = await service.createFromCart(req.user.userId);
        return res.status(201).json((0, apiResponse_1.ok)("Order created", order));
    }
    catch (e) {
        next(e);
    }
}
async function listMine(req, res, next) {
    try {
        const orders = await service.listMyOrders(req.user.userId);
        return res.json((0, apiResponse_1.ok)("Orders", orders));
    }
    catch (e) {
        next(e);
    }
}
async function getMine(req, res, next) {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const order = await service.getMyOrder(req.user.userId, id);
        return res.json((0, apiResponse_1.ok)("Order", order));
    }
    catch (e) {
        next(e);
    }
}
