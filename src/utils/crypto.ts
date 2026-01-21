import crypto from "crypto";

export function hmacSha512Hex(payload: string, secret: string) {
  return crypto.createHmac("sha512", secret).update(payload).digest("hex");
}

export function randomRef(prefix = "ref") {
  return `${prefix}_${crypto.randomBytes(12).toString("hex")}`;
}
