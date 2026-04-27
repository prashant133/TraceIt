import { AppDataSource } from "../../config/db/db";
import { Shoe } from "../../entities/shoes";
import { ApiError } from "../../utils/ApiError";
import { CreateShoeDTO } from "./dto/index";
import { UpdateShoeDTO } from "./dto/update-shoe-dto";

const shoeRepository = AppDataSource.getRepository(Shoe);

export class ShoeService {
  async createShoe(dto: CreateShoeDTO, userId: string) {
    const existingShoe = await shoeRepository.findOne({
      where: {
        modelNumber: dto.modelNumber,
      },
    });
    if (existingShoe) {
      throw new ApiError(403, "Shoe with this model number exists");
    }

    const shoe = shoeRepository.create({
      modelNumber: dto.modelNumber,
      brand: dto.brand,
      name: dto.name,
      description: dto.description,
      manufactureAt: new Date(dto.manufactureAt),
      createdBy: { id: userId },
    });

    await shoeRepository.save(shoe);

    return shoe;
  }
  async getAllShoe(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [shoes, total] = await shoeRepository.findAndCount({
      relations: ["createdBy"],
      skip,
      take: limit,
      order: {
        createdAt: "DESC",
      },
    });

    return {
      shoes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }
  async getSingleShoeByModelNumber(modelNumber: string) {
    const shoe = await shoeRepository.findOne({
      where: { modelNumber },
      relations: ["createdBy"],
    });
    if (!shoe) {
      throw new ApiError(404, "No shoe Found");
    }

    return shoe;
  }

  async getSingleShoeById(shoeId: string) {
    const shoe = await shoeRepository.findOne({
      where: { id: shoeId },
      relations: ["createdBy"],
    });

    if (!shoe) {
      throw new ApiError(400, "shoe Id is requied");
    }
    return shoe;
  }

  async deleteShoe(modelNumber: string) {
    const shoe = await shoeRepository.findOne({
      where: { modelNumber },
    });

    if (!shoe) {
      throw new ApiError(404, "No shoe with that model number");
    }

    await shoeRepository.delete({ modelNumber: shoe.modelNumber });
  }

  async updateShoe(dto: UpdateShoeDTO, modelNumber: string) {
    const shoe = await shoeRepository.findOne({
      where: { modelNumber },
    });

    if (!shoe) {
      throw new ApiError(403, "Shoe not Found");
    }

    await shoeRepository.update(
      { modelNumber },
      {
        brand: dto.brand,
        name: dto.name,
        description: dto.description,
        manufactureAt: dto.manufactureAt,
      },
    );

    const updatedShoe = await shoeRepository.findOne({
      where: { modelNumber },
    });

    return updatedShoe;
  }
}
