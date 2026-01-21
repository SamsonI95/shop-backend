"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.r2Client = r2Client;
exports.randomObjectKey = randomObjectKey;
exports.presignUpload = presignUpload;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const env_1 = require("../config/env");
const error_1 = require("../middlewares/error");
const crypto_1 = __importDefault(require("crypto"));
function mustR2() {
    if (!env_1.env.R2_ACCOUNT_ID ||
        !env_1.env.R2_ACCESS_KEY_ID ||
        !env_1.env.R2_SECRET_ACCESS_KEY ||
        !env_1.env.R2_BUCKET) {
        throw new error_1.AppError("R2 is not configured", 500);
    }
}
function r2Client() {
    mustR2();
    return new client_s3_1.S3Client({
        region: "auto",
        endpoint: `https://${env_1.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: env_1.env.R2_ACCESS_KEY_ID,
            secretAccessKey: env_1.env.R2_SECRET_ACCESS_KEY,
        },
    });
}
function randomObjectKey(ext = "jpg") {
    return `products/${crypto_1.default.randomBytes(16).toString("hex")}.${ext}`;
}
async function presignUpload(objectKey, contentType) {
    const client = r2Client();
    const cmd = new client_s3_1.PutObjectCommand({
        Bucket: env_1.env.R2_BUCKET,
        Key: objectKey,
        ContentType: contentType,
    });
    const url = await (0, s3_request_presigner_1.getSignedUrl)(client, cmd, { expiresIn: 60 });
    const publicUrl = env_1.env.R2_PUBLIC_BASE_URL
        ? `${env_1.env.R2_PUBLIC_BASE_URL}/${objectKey}`
        : undefined;
    return { uploadUrl: url, objectKey, publicUrl };
}
