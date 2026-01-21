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
exports.init = init;
exports.webhook = webhook;
exports.rawBodyJson = rawBodyJson;
const apiResponse_1 = require("../../utils/apiResponse");
const error_1 = require("../../middlewares/error");
const env_1 = require("../../config/env");
const crypto_1 = require("../../utils/crypto");
const service = __importStar(require("./payments.service"));
async function init(req, res, next) {
    try {
        const { orderId } = req.body;
        const result = await service.initPayment(req.user.userId, orderId);
        return res.json((0, apiResponse_1.ok)("Payment initialized", result));
    }
    catch (e) {
        next(e);
    }
}
// Paystack webhook handler
async function webhook(req, res, next) {
    try {
        const signature = req.headers["x-paystack-signature"];
        if (typeof signature !== "string")
            throw new error_1.AppError("Missing signature", 400);
        const rawBody = req.rawBody;
        if (!rawBody)
            throw new error_1.AppError("Missing raw body", 400);
        const expected = (0, crypto_1.hmacSha512Hex)(rawBody, env_1.env.PAYSTACK_WEBHOOK_SECRET);
        if (expected !== signature)
            throw new error_1.AppError("Invalid signature", 401);
        const event = req.body;
        const eventType = event?.event;
        const reference = event?.data?.reference;
        if (!reference)
            throw new error_1.AppError("Missing reference", 400);
        // Only process charge.success for MVP
        if (eventType === "charge.success") {
            await service.handleVerifiedPayment(reference, event);
        }
        return res.json((0, apiResponse_1.ok)("Webhook received"));
    }
    catch (e) {
        next(e);
    }
}
// raw-body middleware for webhook only
function rawBodyJson(req, res, next) {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => {
        const raw = Buffer.concat(chunks).toString("utf8");
        req.rawBody = raw;
        try {
            req.body = raw ? JSON.parse(raw) : {};
        }
        catch {
            return res.status(400).json((0, apiResponse_1.fail)("Invalid JSON"));
        }
        next();
    });
    req.on("error", () => res.status(400).json((0, apiResponse_1.fail)("Bad request")));
}
