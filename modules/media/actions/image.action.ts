"use server";

import { revalidatePath } from "next/cache";
import { uploadVehicleImage, deleteVehicleImageFromStorage } from "../services/storage.service";
import * as repo from "../repositories/image.repository";

export interface ImageActionResult {
  success: boolean;
  message: string;
}

export async function uploadImageAction(
  vehicleId: string,
  formData: FormData
): Promise<ImageActionResult> {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { success: false, message: "No file selected." };
  }

  // Basic validation
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, message: "File too large (max 5MB)." };
  }
  if (!file.type.startsWith("image/")) {
    return { success: false, message: "Only image files allowed." };
  }

  try {
    const { path, publicUrl } = await uploadVehicleImage(vehicleId, file);

    const count = await repo.countVehicleImages(vehicleId);
    const isPrimary = count === 0;

    await repo.createVehicleImage(vehicleId, publicUrl, isPrimary, count);

    // Also store the storage path for later deletion — best to save it.
    // For simplicity, we store the full URL and derive the path when deleting.

    revalidatePath(`/admin/vehicles/${vehicleId}/images`);
    revalidatePath("/admin/vehicles");
    revalidatePath("/vehicles");

    return { success: true, message: "Image uploaded." };
  } catch (err) {
    console.error("Upload error:", err);
    return { success: false, message: "Failed to upload image." };
  }
}

export async function deleteImageAction(
  vehicleId: string,
  imageId: string
): Promise<ImageActionResult> {
  try {
    const url = await repo.deleteVehicleImage(imageId);

    // Extract storage path from URL
    if (url) {
      const match = url.match(/vehicle-images\/(.+)$/);
      if (match) {
        await deleteVehicleImageFromStorage(match[1]);
      }
    }

    revalidatePath(`/admin/vehicles/${vehicleId}/images`);
    revalidatePath("/admin/vehicles");
    revalidatePath("/vehicles");

    return { success: true, message: "Image deleted." };
  } catch (err) {
    console.error("Delete error:", err);
    return { success: false, message: "Failed to delete image." };
  }
}

export async function setPrimaryImageAction(
  vehicleId: string,
  imageId: string
): Promise<ImageActionResult> {
  try {
    await repo.setPrimaryImage(vehicleId, imageId);
    revalidatePath(`/admin/vehicles/${vehicleId}/images`);
    revalidatePath("/admin/vehicles");
    revalidatePath("/vehicles");
    return { success: true, message: "Primary image updated." };
  } catch (err) {
    console.error("Set primary error:", err);
    return { success: false, message: "Failed to set primary image." };
  }
}