import express from "express";
import { validateDto } from "../../utils/validator";
import { ForgotPasswordDTO, ResetPasswordDTO, VerifyEmailDTO } from "./dto";
import { OTPController } from "./otp.controller";

const router = express.Router();

const otpController = new OTPController();

router.post(
  "/verify-email",
  validateDto(VerifyEmailDTO),
  otpController.verifyEmail,
);

router.post(
  "/forgot-password",
  validateDto(ForgotPasswordDTO),
  otpController.forgotPassword,
);

router.post(
  "/reset-password",
  validateDto(ResetPasswordDTO),
  otpController.resetPassword,
);
export default router;
