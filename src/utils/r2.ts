import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "../config/env";
import { AppError } from "../middlewares/error";
import crypto from "crypto";

function mustR2() {
  if (
    !env.R2_ACCOUNT_ID ||
    !env.R2_ACCESS_KEY_ID ||
    !env.R2_SECRET_ACCESS_KEY ||
    !env.R2_BUCKET
  ) {
    throw new AppError("R2 is not configured", 500);
  }
}

export function r2Client() {
  mustR2();
  return new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID!,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

export function randomObjectKey(ext = "jpg") {
  return `products/${crypto.randomBytes(16).toString("hex")}.${ext}`;
}

export async function presignUpload(objectKey: string, contentType: string) {
  const client = r2Client();
  const cmd = new PutObjectCommand({
    Bucket: env.R2_BUCKET!,
    Key: objectKey,
    ContentType: contentType,
  });
  const url = await getSignedUrl(client, cmd, { expiresIn: 60 });
  const publicUrl = env.R2_PUBLIC_BASE_URL
    ? `${env.R2_PUBLIC_BASE_URL}/${objectKey}`
    : undefined;
  return { uploadUrl: url, objectKey, publicUrl };
}
