import express from "express";
import { validateDto } from "../../utils/validator";
import { RegisterDTO } from "./dto";
import { AuthController } from "./auth.controller";
import { LoginDTO } from "./dto/login.dto";

const router = express.Router();

const authController = new AuthController();

router.post("/register", validateDto(RegisterDTO), authController.register);
router.post("/login",validateDto(LoginDTO),authController.login)

export default router;
