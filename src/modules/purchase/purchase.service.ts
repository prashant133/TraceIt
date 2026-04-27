import { AppDataSource } from "../../config/db/db";
import { Purchase } from "../../entities/purchases";
import { Shoe } from "../../entities/shoes";
import { ApiError } from "../../utils/ApiError";
import { PurchaseShoeDTO } from "./dto/index";

const purchaseRepository = AppDataSource.getRepository(Purchase);
const shoeRepository = AppDataSource.getRepository(Shoe);

export class PurchaseService {
  async purchaseShoe(dto: PurchaseShoeDTO, userId: string) {
    // Find shoe using modelNumber
    const shoe = await shoeRepository.findOne({
      where: { modelNumber: dto.modelNumber },
    });

    if (!shoe) {
      throw new ApiError(404, "Shoe not found");
    }

    // Check if same user already purchased same shoe
    const existingPurchase = await purchaseRepository.findOne({
      where: {
        shoe: { id: shoe.id },
      },
    });

    if (existingPurchase) {
      throw new ApiError(400, "Shoe already purchased ");
    }

    // Create purchase
    const purchase = purchaseRepository.create({
      user: { id: userId },
      shoe: { id: shoe.id },
      purchasedAt: new Date(),
    });

    await purchaseRepository.save(purchase);

    return {
      message: "Shoe purchased successfully",
    };
  }
}
