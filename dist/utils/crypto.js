"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hmacSha512Hex = hmacSha512Hex;
exports.randomRef = randomRef;
const crypto_1 = __importDefault(require("crypto"));
function hmacSha512Hex(payload, secret) {
    return crypto_1.default.createHmac("sha512", secret).update(payload).digest("hex");
}
function randomRef(prefix = "ref") {
    return `${prefix}_${crypto_1.default.randomBytes(12).toString("hex")}`;
}
