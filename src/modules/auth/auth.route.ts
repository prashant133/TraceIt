import express from "express";
import { validateDto } from "../../utils/validator";
import { AuthController } from "./auth.controller";
import { LoginDTO } from "./dto/login.dto";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { RegisterDTO } from "./dto/register.dto";
import { loginRateLimit } from "../../middlewares/rateLimiter";

const router = express.Router();

const authController = new AuthController();

router.post("/register", validateDto(RegisterDTO), authController.register);
router.post(
  "/login",
  loginRateLimit,
  validateDto(LoginDTO),
  authController.login,
);
router.post("/logout", authMiddleware, authController.logout);
router.post("/refresh-token", authController.refreshToken);
router.get("/get-current-user", authMiddleware, authController.getCurrentUser);

export default router;
