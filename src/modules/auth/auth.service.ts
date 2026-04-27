import { AppDataSource } from "../../config/db/db";
import { OTPType } from "../../constants";
import { User } from "../../entities/users";
import { ApiError } from "../../utils/ApiError";
import { sendOTPEmail } from "../../utils/emailConfig";
import { generateOtp } from "../../utils/generateOtp";
import { RegisterDTO } from "./dto/index";
import * as bcrypt from "bcrypt";
import { LoginDTO } from "./dto/login.dto";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken";

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

  async login(dto: LoginDTO) {
    const user = await userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (!user.isEmailVerified) {
      throw new ApiError(403, "Please verify your Email first");
    }

    if (user.loginAttempts >= 5) {
      throw new ApiError(423, "Account Locked. Please reset you password");
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      user.loginAttempts += 1;
      await userRepository.save(user);
      throw new ApiError(
        401,
        `Invalid credentials. ${5 - user.loginAttempts} attempts remaining`,
      );
    }
    user.loginAttempts = 0;

    const accessToken = await generateAccessToken(user.id);
    const refreshToken = await generateRefreshToken(user.id);

    await userRepository.save(user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }
}
