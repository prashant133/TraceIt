import { Router } from "express";
import { PurchaseController } from "./purchase.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { validateDto } from "../../utils/validator";
import { PurchaseShoeDTO } from "./dto";

const router = Router();

const purchaseController = new PurchaseController();

router.post(
  "/",
  authMiddleware,
  validateDto(PurchaseShoeDTO),
  purchaseController.purchaseshoe,
);

export default router;
