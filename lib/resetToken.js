import { createHash } from "crypto";

export const hashToken = (token) =>
  createHash("sha256").update(String(token)).digest("hex");
