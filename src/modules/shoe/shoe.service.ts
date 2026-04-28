import { AppDataSource } from "../../config/db/db";
import { AuditAction, OTPType } from "../../constants";
import { Purchase } from "../../entities/purchases";
import { Shoe } from "../../entities/shoes";
import { User } from "../../entities/users";
import { ApiError } from "../../utils/ApiError";
import { createAuditLogs } from "../../utils/auditLogs";
import { deleteImageFromCloudinary } from "../../utils/deleteImage";
import { sendOTPEmail } from "../../utils/emailConfig";
import { generateOtp } from "../../utils/generateOtp";
import { uploadImage } from "../../utils/uploadImage";
import { CreateShoeDTO, UpdateShoeDTO, VerifyShoeDTO } from "./dto/index";

const shoeRepository = AppDataSource.getRepository(Shoe);

export class ShoeService {
  async createShoe(dto: CreateShoeDTO, userId: string, filePath?: string) {
    const existingShoe = await shoeRepository.findOne({
      where: {
        modelNumber: dto.modelNumber,
      },
    });
    if (existingShoe) {
      throw new ApiError(403, "Shoe with this model number exists");
    }

    let imageUrl: string | null = null;
    if (filePath) {
      imageUrl = await uploadImage(filePath);
    }

    const shoe = shoeRepository.create({
      modelNumber: dto.modelNumber,
      brand: dto.brand,
      name: dto.name,
      description: dto.description,
      manufactureAt: new Date(dto.manufactureAt),
      imageUrl,
      createdBy: { id: userId },
    });

    await shoeRepository.save(shoe);

    await createAuditLogs(AuditAction.SHOE_CREATED, "Shoe", shoe.id, userId, {
      modelNumber: shoe.modelNumber,
      brand: shoe.brand,
      name: shoe.name,
      message: "Shoe created successfully",
    });

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

  async deleteShoe(modelNumber: string, userId: string) {
    const shoe = await shoeRepository.findOne({
      where: { modelNumber },
    });

    if (!shoe) {
      throw new ApiError(404, "No shoe with that model number");
    }

    await shoeRepository.delete({ modelNumber: shoe.modelNumber });

    if (!shoe.imageUrl) {
      throw new ApiError(404, "No Image url");
    }
    await deleteImageFromCloudinary(shoe.imageUrl);

    await createAuditLogs(AuditAction.SHOE_DELETED, "Shoe", shoe.id, userId, {
      modelNumber: shoe.modelNumber,
      brand: shoe.brand,
      name: shoe.name,
      message: "Shoe created successfully",
    });
  }
  async updateShoe(
    dto: UpdateShoeDTO,
    modelNumber: string,
    userId: string,
    filePath?: string,
  ) {
    const shoe = await shoeRepository.findOne({
      where: { modelNumber },
    });

    if (!shoe) {
      throw new ApiError(403, "Shoe not found");
    }

    let newImageUrl = shoe.imageUrl;

    if (filePath) {
      if (shoe.imageUrl) {
        await deleteImageFromCloudinary(shoe.imageUrl);
      }

      newImageUrl = await uploadImage(filePath);
    }

    await shoeRepository.update(
      { modelNumber },
      {
        brand: dto.brand,
        name: dto.name,
        description: dto.description,
        manufactureAt: dto.manufactureAt,
        imageUrl: newImageUrl,
      },
    );

    const updatedShoe = await shoeRepository.findOne({
      where: { modelNumber },
    });

    await createAuditLogs(AuditAction.SHOE_UPDATED, "Shoe", shoe.id, userId, {
      modelNumber: shoe.modelNumber,
      brand: shoe.brand,
      name: shoe.name,
      message: "Shoe updated successfully",
    });

    return updatedShoe;
  }

  async verifyShoe(dto: VerifyShoeDTO, userId: string) {
    const shoe = await shoeRepository.findOne({
      where: { modelNumber: dto.modelNumber },
    });

    if (!shoe) {
      throw new ApiError(404, "Shoe not found");
    }

    const purchase = await AppDataSource.getRepository(Purchase).findOne({
      where: {
        user: { id: userId },
        shoe: { id: shoe.id },
      },
      relations: ["user"],
    });

    if (!purchase) {
      throw new ApiError(403, "You have not purchased this shoe");
    }

    const code = await generateOtp(
      { id: userId } as User,
      OTPType.VIEW_SHOE,
      shoe.id,
    );

    await sendOTPEmail(purchase.user.email, code, OTPType.VIEW_SHOE);

    return {
      message: "Otp Sent you your email",
    };
  }
}
