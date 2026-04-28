import express from "express";
import { validateDto } from "../../utils/validator";
import { ForgotPasswordDTO, ResetPasswordDTO, VerifyEmailDTO } from "./dto";
import { OTPController } from "./otp.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { ViewShoeDTO } from "./dto/view-shoe-dto";
import { otpRateLimit } from "../../middlewares/rateLimiter";

const router = express.Router();

const otpController = new OTPController();

router.post(
  "/verify-email",
  otpRateLimit,
  validateDto(VerifyEmailDTO),
  otpController.verifyEmail,
);

router.post(
  "/forgot-password",
  otpRateLimit,
  validateDto(ForgotPasswordDTO),
  otpController.forgotPassword,
);

router.post(
  "/reset-password",
  otpRateLimit,
  validateDto(ResetPasswordDTO),
  otpController.resetPassword,
);
router.post(
  "/view-shoe",
  otpRateLimit,
  authMiddleware,
  validateDto(ViewShoeDTO),
  otpController.viewShoe,
);
export default router;
