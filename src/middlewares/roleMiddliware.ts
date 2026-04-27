import { Role } from "../constants";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export function checkRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "Forbidden - Insufficient permissions");
    }

    next();
  };
}
