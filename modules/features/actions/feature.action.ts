"use server";

import { revalidatePath } from "next/cache";
import { setVehicleFeatures } from "../repositories/feature.repository";

export async function saveVehicleFeaturesAction(
  vehicleId: string,
  featureIds: string[]
): Promise<{ success: boolean; message: string }> {
  try {
    await setVehicleFeatures(vehicleId, featureIds);
    revalidatePath(`/admin/vehicles/${vehicleId}/edit`);
    revalidatePath("/admin/vehicles");
    revalidatePath("/vehicles");
    return { success: true, message: "Features saved." };
  } catch (err) {
    console.error("Save features error:", err);
    return { success: false, message: "Failed to save features." };
  }
}