import "dotenv/config";
import crypto from "node:crypto";

export function getSHA256(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}
