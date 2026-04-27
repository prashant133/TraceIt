import jwt from "jsonwebtoken";
import { env } from "../env";

export function generateAccessToken(userId: string) {
  return jwt.sign({ id: userId }, env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
}

export function generateRefreshToken(userId: string) {
  return jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}
