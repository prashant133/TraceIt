import cloudinary from "../config/cloudinary";

export const uploadImage = async (filePath: string): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "image",
      folder: "shoes",
    });
    return result.secure_url;
  } catch (error) {
    throw error;
  }
};
