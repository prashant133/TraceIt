import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { OTPService } from "./otp.service";
import { ApiResponse } from "../../utils/ApiResponse";

const otpService = new OTPService();

export class OTPController {
  verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const result = await otpService.verifyEmail(req.body);

    return res
      .status(200)
      .json(new ApiResponse(200, result, "Email verified Successfully"));
  });

  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const result = await otpService.forgotPassword(req.body);
    return res
      .status(200)
      .json(new ApiResponse(200, result, "OTP send successfully"));
  });

  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const result = await otpService.resetPassword(req.body);

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    return res
      .status(200)
      .json(new ApiResponse(200, result, "Password reset successfully"));
  });

  viewShoe = asyncHandler(async (req: Request, res: Response) => {
    const result = await otpService.viewShoe(req.body);
    return res
      .status(200)
      .json(new ApiResponse(200, result, "Shoe details fetched successfully"));
  });
}
