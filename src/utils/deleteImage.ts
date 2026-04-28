import cloudinary from "../config/cloudinary";

export const deleteImageFromCloudinary = async (imageUrl: string) => {
  const parts = imageUrl.split("/");

  const publicIdWithExtension = parts.slice(7).join("/");

  const publicId = publicIdWithExtension.split(".")[0];

  try {
    const result = await cloudinary.uploader.destroy(publicId!, {
      resource_type: "image",
    });

    console.log("Deleted file : ", result);
  } catch (error) {
    console.log("Error while deleting file from cloudingary", error);
  }
};
