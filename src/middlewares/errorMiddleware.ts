import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: any[] = [];

  // Handle custom ApiError
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.error;
  }

  // Handle unknown errors
  else if (err.message) {
    message = err.message;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
