import { Router } from "express";
import { ShoeController } from "./shoe.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { checkRole } from "../../middlewares/roleMiddliware";
import { CreateShoeDTO } from "./dto/index";
import { validateDto } from "../../utils/validator";
import { Role } from "../../constants";

const router = Router();

const shoeController = new ShoeController();

router.post(
  "/",
  authMiddleware,
  checkRole(Role.ADMIN),
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
  shoeController.updateShoe,
);

export default router;
