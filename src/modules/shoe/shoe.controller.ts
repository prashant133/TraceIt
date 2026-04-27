import { Request, Response } from "express";

import { ShoeService } from "./shoe.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";
import { ApiError } from "../../utils/ApiError";

const shoeService = new ShoeService();

export class ShoeController {
  createShoe = asyncHandler(async (req: Request, res: Response) => {
    const result = await shoeService.createShoe(req.body, req.user!.id);

    return res
      .status(200)
      .json(new ApiResponse(201, result, "Shoe created successfully"));
  });

  getAllShoe = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await shoeService.getAllShoe(page, limit);
    return res
      .status(200)
      .json(new ApiResponse(200, result, "Shoes fetched successfully"));
  });

  getSingleShoeByModelNumber = asyncHandler(
    async (req: Request, res: Response) => {
      const modelNumber = req.params.modelNumber as string;

      if (!modelNumber) {
        throw new ApiError(400, "Model number is required");
      }

      const result = await shoeService.getSingleShoeByModelNumber(modelNumber);

      return res
        .status(200)
        .json(new ApiResponse(200, result, "Shoe fetched successfully"));
    },
  );

  getSingleShoeById = asyncHandler(async (req: Request, res: Response) => {
    const shoeId = req.params.shoeId as string;

    if (!shoeId) {
      throw new ApiError(404, "No shoe Found");
    }
    const result = await shoeService.getSingleShoeById(shoeId);

    return res
      .status(200)
      .json(new ApiResponse(200, result, "Shoe fetched successfully"));
  });

  deleteShoe = asyncHandler(async (req: Request, res: Response) => {
    const modelNumber = req.params.modelNumber as string;

    if (!modelNumber) {
      throw new ApiError(400, "Model number is required");
    }

    const result = await shoeService.deleteShoe(modelNumber);

    return res
      .status(200)
      .json(new ApiResponse(200, result, "shoe deleted successfully"));
  });

  updateShoe = asyncHandler(async (req: Request, res: Response) => {
    const modelNumber = req.params.modelNumber as string;

    if (!modelNumber) {
      throw new ApiError(400, "Model number is required");
    }

    const result = await shoeService.updateShoe(req.body, modelNumber);

    return res
      .status(200)
      .json(new ApiResponse(200, result, "shoe updated successfully"));
  });
}
