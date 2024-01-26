import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

import { CustomError } from "../custom-error.js";

cloudinary.config({
  secure: true,
});

export async function uploadPhoto(photo_url: string) {
  try {
    const result = await cloudinary.uploader.upload(photo_url);
    return result.secure_url;
  } catch (error) {
    throw new CustomError("Error al subir foto.", 500);
  }
}
