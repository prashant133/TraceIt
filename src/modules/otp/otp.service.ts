import { AppDataSource } from "../../config/db/db";
import { OTPType } from "../../constants";
import { Otp } from "../../entities/otps";
import { User } from "../../entities/users";
import { ApiError } from "../../utils/ApiError";
import { VerifyEmailDTO } from "./dto";

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
  }
}
