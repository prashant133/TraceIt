import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../env";
import { AppDataSource } from "../config/db/db";
import { User } from "../entities/users";
import { ApiError } from "../utils/ApiError";
import * as bcrypt from "bcrypt";
import { generateAccessToken } from "../utils/generateToken";
import { Role } from "../constants";

// extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
      tokenPayload?: {
        id: string;
        role: Role;
        fullName: string;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (!accessToken && !refreshToken) {
      throw new ApiError(401, "Please login again ");
    }

    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, env.JWT_ACCESS_SECRET) as {
          id: string;
        };

        const user = await AppDataSource.getRepository(User).findOne({
          where: {
            id: decoded.id,
          },
        });

        if (!user) {
          throw new ApiError(404, "Unauthorized- user not found");
        }

        if (!user.isEmailVerified) {
          throw new ApiError(403, "verfy your email first");
        }

        req.user = user;
        return next();
      } catch (error) {
        next(new ApiError(401, "Unauthorized - Invalid Token"));
      }
    }

    if (!refreshToken) {
      throw new ApiError(401, "Unauthorized please login again");
    }

    try {
      const decode = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
        id: string;
      };

      const user = await AppDataSource.getRepository(User).findOne({
        where: {
          id: decode.id,
        },
      });

      if (!user || !user.refreshToken) {
        throw new ApiError(401, "Unauthorized token");
      }

      const isValid = await bcrypt.compare(refreshToken, user.refreshToken);

      if (!isValid) {
        throw new ApiError(400, "Unauthorized Invalid token");
      }

      const newAccessToken = await generateAccessToken(
        user.id,
        user.role,
        user.fullName,
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      req.user = user;
      return next();
    } catch (error) {
      next(new ApiError(401, "Unauthorized - Invalid token"));
    }
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    next(new ApiError(401, "Unauthorized - Invalid token"));
  }
};
