import { Router } from "express";
import { ShoeController } from "./shoe.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { checkRole } from "../../middlewares/roleMiddliware";
import { CreateShoeDTO, VerifyShoeDTO } from "./dto/index";
import { validateDto } from "../../utils/validator";
import { Role } from "../../constants";
import { otpRateLimit } from "../../middlewares/rateLimiter";
import { upload } from "../../config/multer";

const router = Router();

const shoeController = new ShoeController();

router.post(
  "/",
  authMiddleware,
  checkRole(Role.ADMIN),
  upload.single("image"),
  validateDto(CreateShoeDTO),
  shoeController.createShoe,
);

router.get(
  "/",
  authMiddleware,
  checkRole(Role.ADMIN),
  shoeController.getAllShoe,
);
router.get(
  "/model/:modelNumber",
  authMiddleware,
  checkRole(Role.ADMIN),
  shoeController.getSingleShoeByModelNumber,
);

router.get(
  "/id/:shoeId",
  authMiddleware,
  checkRole(Role.ADMIN),
  shoeController.getSingleShoeById,
);

router.delete(
  "/:modelNumber",
  authMiddleware,
  checkRole(Role.ADMIN),
  shoeController.deleteShoe,
);

router.put(
  "/:modelNumber",
  authMiddleware,
  checkRole(Role.ADMIN),
  upload.single("image"),
  shoeController.updateShoe,
);

router.post(
  "/verify",
  authMiddleware,
  otpRateLimit,
  validateDto(VerifyShoeDTO),
  shoeController.verifyShoe,
);

export default router;
