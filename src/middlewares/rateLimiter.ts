import { client } from "../config/redis";
import { NextFunction, Request, Response } from "express";

export const createRateLimiter = (
  prefix: string,
  maxAttempts: number,
  windowSeconds: number,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = req.ip;
      const key = `${prefix}:${ip}`;

      const attempts = await client.incr(key);

      if (attempts === 1) {
        await client.expire(key, windowSeconds);
      }

      if (attempts > maxAttempts) {
        const ttl = await client.ttl(key);
        return res.status(429).json({
          success: false,
          message: `Too many attempts. Try again in ${ttl} seconds`,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const loginRateLimit = createRateLimiter("login", 5, 10 * 60);
export const otpRateLimit = createRateLimiter("otp", 3, 60);
export const globalRateLimit = createRateLimiter("global", 100, 15 * 60);
