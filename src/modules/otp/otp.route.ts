import express from "express";
import { validateDto } from "../../utils/validator";
import { VerifyEmailDTO } from "./dto";
import { OTPController } from "./otp.controller";

const router = express.Router();

const otpController = new OTPController();

router.post(
  "/verify-email",
  validateDto(VerifyEmailDTO),
  otpController.verifyEmail,
);

export default router;
