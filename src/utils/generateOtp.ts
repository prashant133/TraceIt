import { AppDataSource } from "../config/db/db";
import { OTPType } from "../constants";
import { Otp } from "../entities/otps";
import { User } from "../entities/users";


export async function generateOtp(user: User, type: OTPType, shoeId?: string) {
  const otpRepository = AppDataSource.getRepository(Otp);

  // invalidate existing unused OTPs using find and save
  const existingOtps = await otpRepository.find({
    where: {
      user: { id: user.id },
      type,
      isUsed: false,
    },
    relations: ["user"],
  });

  if (existingOtps.length > 0) {
    await otpRepository.save(
      existingOtps.map((otp) => ({ ...otp, isUsed: true })),
    );
  }

  // generate new OTP
  const code = Math.floor(1000 + Math.random() * 9000).toString();

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 1);

  const otp = otpRepository.create({
    otpCode: code,
    type,
    user,
    expiresAt,
    shoeId: shoeId || null,
  });

  await otpRepository.save(otp);

  return code;
}
