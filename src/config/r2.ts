import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";

const requireEnv = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${requireEnv(
    env.R2_ACCOUNT_ID,
    "R2_ACCOUNT_ID",
  )}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: requireEnv(env.R2_ACCESS_KEY_ID, "R2_ACCESS_KEY_ID"),
    secretAccessKey: requireEnv(
      env.R2_SECRET_ACCESS_KEY,
      "R2_SECRET_ACCESS_KEY",
    ),
  },
});
