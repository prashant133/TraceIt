import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { AuthService } from "./auth.service";
import { ApiResponse } from "../../utils/ApiResponse";

const authService = new AuthService();

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);

    return res
      .status(201)
      .json(new ApiResponse(201, result, "User created successfully"));
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);

    return res
      .status(200)
      .json(new ApiResponse(200, result, "Loggged in succussfully"));
  });
}
