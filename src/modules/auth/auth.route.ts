import express from "express";
import { validateDto } from "../../utils/validator";
import { RegisterDTO } from "./dto";
import { AuthController } from "./auth.controller";

const router = express.Router();

const authController = new AuthController();

router.post("/register", validateDto(RegisterDTO), authController.register);

export default router;
