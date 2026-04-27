import { NextFunction, Request, Response } from "express";
import { PurchaseService } from "./purchase.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";

const purchaseService = new PurchaseService();

export class PurchaseController {
  purchaseshoe = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user!.id;

      if (!userId) {
        throw new ApiError(401, "Unauthorized");
      }
      const result = await purchaseService.purchaseShoe(req.body, userId);

      return res
        .status(200)
        .json(new ApiResponse(200, result, "Shoe Purchase Successful"));
    },
  );
}
