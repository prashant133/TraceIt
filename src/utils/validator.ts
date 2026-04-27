import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { ApiError } from "./ApiError";

export function validateDto(DtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(DtoClass, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const messages = errors.map((err) =>
        Object.values(err.constraints || {}).join(", "),
      );
      return next(new ApiError(400, "Validation Error", messages));
    }

    req.body = dto;
    next();
  };
}
