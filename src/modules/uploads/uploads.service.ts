import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "../../config/env";
import { r2 } from "../../config/r2";
import crypto from "crypto";

function safeExt(filename: string) {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "bin";
}

export async function presignProductImageUpload(filename: string, contentType: string) {
  // Basic allowlist
  const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
  if (!allowed.has(contentType)) {
    throw new Error("Unsupported image type");
  }

  const ext = safeExt(filename);
  const key = `products/${crypto.randomUUID()}.${ext}`;

  const cmd = new PutObjectCommand({
    Bucket: env.R2_BUCKET,
    Key: key,
    ContentType: contentType,
    // Optional: make it public only if your bucket is set up that way; otherwise omit.
    // ACL: "public-read", // R2 doesn't use ACL the same way; usually handled via public bucket/custom domain.
  });

  const uploadUrl = await getSignedUrl(r2, cmd, { expiresIn: 60 }); // 60 seconds
  const publicUrl = `${env.R2_PUBLIC_BASE_URL}/${key}`;

  return { key, uploadUrl, publicUrl };
}
