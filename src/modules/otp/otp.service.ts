import { AppDataSource } from "../../config/db/db";
import { AuditAction, OTPType } from "../../constants";
import { Otp } from "../../entities/otps";
import { Shoe } from "../../entities/shoes";
import { User } from "../../entities/users";
import { ApiError } from "../../utils/ApiError";
import { sendOTPEmail } from "../../utils/emailConfig";
import { generateOtp } from "../../utils/generateOtp";
import {
  ForgotPasswordDTO,
  ResetPasswordDTO,
  VerifyEmailDTO,
} from "./dto/index";

import * as bcrypt from "bcrypt";
import { ViewShoeDTO } from "./dto/view-shoe-dto";
import { createAuditLogs } from "../../utils/auditLogs";

const otpRepository = AppDataSource.getRepository(Otp);
const userRepository = AppDataSource.getRepository(User);

export class OTPService {
  async verifyEmail(dto: VerifyEmailDTO) {
    const otp = await otpRepository.findOne({
      where: { otpCode: dto.code, type: OTPType.EMAIL_VERIFY },
      relations: ["user"],
    });

    if (!otp) {
      throw new ApiError(404, "OTP not found");
    }

    if (otp.isUsed) {
      throw new ApiError(400, "OTP has be used");
    }

    if (new Date() > otp.expiresAt) {
      throw new ApiError(400, "OTP has expired");
    }

    otp.isUsed = true;
    await otpRepository.save(otp);

    otp.user.isEmailVerified = true;

    await userRepository.save(otp.user);
    await createAuditLogs(
      AuditAction.EMAIL_VERIFIED,
      "OTP",
      otp.user.id,
      otp.user.id,
      {
        email: otp.user.email,
        fullName: otp.user.fullName,
      },
    );
  }

  async forgotPassword(dto: ForgotPasswordDTO) {
    const user = await userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new ApiError(404, "User not Found");
    }

    if (!user.isEmailVerified) {
      throw new ApiError(404, "Please verify your email");
    }

    const code = await generateOtp(user, OTPType.PASSWORD_RESET);

    await sendOTPEmail(user.email, code, OTPType.PASSWORD_RESET);

    return {
      message: "Password rest otp sent you your email",
    };
  }

  async resetPassword(dto: ResetPasswordDTO) {
    const otp = await otpRepository.findOne({
      where: {
        otpCode: dto.code,
        type: OTPType.PASSWORD_RESET,
      },
      relations: ["user"],
    });

    if (!otp) {
      throw new ApiError(404, "Invalid OTP");
    }

    if (otp.isUsed) {
      throw new ApiError(400, "OTP is already used");
    }
    if (new Date() > otp.expiresAt) {
      throw new ApiError(400, "OTP has Expired");
    }

    otp.isUsed = true;
    await otpRepository.save(otp);
    console.log("Here");

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    otp.user.password = hashedPassword;
    otp.user.loginAttempts = 0;
    otp.user.refreshToken = null;

    console.log("here 2");

    await userRepository.save(otp.user);

    createAuditLogs(
      AuditAction.PASSWORD_RESET,
      "OTP",
      otp.user.id,
      otp.user.id,
      {
        email: otp.user.email,
        fullName: otp.user.fullName,
      },
    );

    return {
      message: "Password reset successfully",
    };
  }

  async viewShoe(dto: ViewShoeDTO) {
    const otp = await otpRepository.findOne({
      where: { otpCode: dto.code, type: OTPType.VIEW_SHOE, isUsed: false },
      relations: ["user"],
    });

    if (!otp) {
      throw new ApiError(404, "No otp Found");
    }

    if (otp.isUsed) {
      throw new ApiError(400, "OTP is used");
    }

    if (new Date() > otp.expiresAt) {
      throw new ApiError(400, "OTP has expired");
    }

    if (!otp.shoeId) {
      throw new ApiError(400, "Invalid OTP");
    }

    otp.isUsed = true;
    await otpRepository.save(otp);


    createAuditLogs(
      AuditAction.SHOE_VIEWED,
      "OTP",
      otp.user.id,
      otp.user.id,
      {
        email: otp.user.email,
        fullName: otp.user.fullName,
      },
    );

    //  shoe details
    const shoe = await AppDataSource.getRepository(Shoe).findOne({
      where: { id: otp.shoeId! },
    });

    if (!shoe) {
      throw new ApiError(404, "Shoe not found");
    }

    return shoe;
  }
}
