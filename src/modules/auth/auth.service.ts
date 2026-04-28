import { AppDataSource } from "../../config/db/db";
import { AuditAction, OTPType } from "../../constants";
import { User } from "../../entities/users";
import { ApiError } from "../../utils/ApiError";
import { sendOTPEmail } from "../../utils/emailConfig";
import { generateOtp } from "../../utils/generateOtp";
import { RegisterDTO, LoginDTO } from "./dto/index";
import * as bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken";
import * as jwt from "jsonwebtoken";
import { env } from "../../env";
import { createAuditLogs } from "../../utils/auditLogs";

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

    await createAuditLogs(
      AuditAction.USER_REGISTERED,
      "User",
      user.id,
      user.id,
      {
        email: user.email,
        fullName: user.fullName,
        message: "User Registered succesfully",
      },
    );

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

    const accessToken = await generateAccessToken(
      user.id,
      user.role,
      user.fullName,
    );
    const refreshToken = await generateRefreshToken(user.id);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    user.refreshToken = hashedRefreshToken;

    await userRepository.save(user);

    await createAuditLogs(
      AuditAction.USER_LOGGED_IN,
      "User",
      user.id,
      user.id,
      {
        email: user.email,
        fullName: user.fullName,
        message: "User Logged in successfuly",
      },
    );

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

  async logout(userId: string) {
    const user = await userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(404, "User not Found");
    }

    user.refreshToken = null;

    userRepository.save(user);

    await createAuditLogs(
      AuditAction.USER_LOGGED_OUT,
      "User",
      user.id,
      user.id,
      {
        email: user.email,
        fullName: user.fullName,
        messag: "User Logged out successfully",
      },
    );

    return {
      message: "Logged out successfully",
    };
  }

  async refreshToken(token: string) {
    const decoded = (await jwt.verify(token, env.JWT_REFRESH_SECRET)) as {
      id: string;
    };

    const user = await userRepository.findOne({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new ApiError(404, "No user Found");
    }

    if (!user.refreshToken) {
      throw new ApiError(401, "Unauthorized - Please login again");
    }

    const isValid = await bcrypt.compare(token, user.refreshToken);
    if (!isValid) {
      throw new ApiError(401, "Unauthorized - Invalid refresh token");
    }

    const accessToken = await generateAccessToken(
      user.id,
      user.role,
      user.fullName,
    );

    return { accessToken };
  }

  async getCurrentUser(userId: string) {
    const user = await userRepository.findOne({
      where: {
        id: userId,
      },
    });

    createAuditLogs(AuditAction.GET_CURRENT_USER, "User", userId, userId, {
      email: user?.email,
      fullName: user?.fullName,
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  }
}
