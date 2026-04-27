import { Request, Response, NextFunction } from "express";

interface customError extends Error {
  statusCode?: number;
}

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error: customError = new Error(`Route not found : ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};
