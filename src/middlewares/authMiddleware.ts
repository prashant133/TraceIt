import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../env";
import { AppDataSource } from "../config/db/db";
import { User } from "../entities/users";
import { ApiError } from "../utils/ApiError";

// extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      throw new ApiError(401, "Unauthorized - No token provided");
    }

    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as { id: string };

    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new ApiError(401, "Unauthorized - User not found");
    }

    if (!user.isEmailVerified) {
      throw new ApiError(403, "Please verify your email first");
    }

    req.user = user;

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    next(new ApiError(401, "Unauthorized - Invalid token"));
  }
};
