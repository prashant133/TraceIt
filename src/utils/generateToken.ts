import jwt from "jsonwebtoken";
import { env } from "../env";
import { Role } from "../constants";

export function generateAccessToken(
  userId: string,
  role: Role,
  fullName: string,
) {
  return jwt.sign({ id: userId, role, fullName }, env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
}

export function generateRefreshToken(userId: string) {
  return jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}
