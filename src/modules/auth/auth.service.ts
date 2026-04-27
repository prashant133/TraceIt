import { AppDataSource } from "../../config/db/db";
import { OTPType } from "../../constants";
import { User } from "../../entities/users";
import { ApiError } from "../../utils/ApiError";
import { sendOTPEmail } from "../../utils/emailConfig";
import { generateOtp } from "../../utils/generateOtp";
import { RegisterDTO } from "./dto/index";
import * as bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(User);

export class AuthService {
  async register(dto: RegisterDTO) {
    const existingUser = await userRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ApiError(409, "User Already exists");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await userRepository.create({
      fullName: dto.fullName,
      email: dto.email,
      password: hashedPassword,
    });

    await userRepository.save(user);

    const code = await generateOtp(user, OTPType.EMAIL_VERIFY);

    await sendOTPEmail(user.email, code, OTPType.EMAIL_VERIFY);
  }
}
