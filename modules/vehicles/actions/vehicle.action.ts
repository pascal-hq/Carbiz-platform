"use server";

import { revalidatePath } from "next/cache";
import { vehicleSchema, slugify } from "../validators/vehicle.validator";
import * as repo from "../repositories/vehicle.repository";

export interface ActionResult {
  success: boolean;
  message: string;
  id?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function createVehicleAction(
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    title: formData.get("title"),
    make: formData.get("make"),
    model: formData.get("model"),
    year: formData.get("year"),
    price: formData.get("price"),
    mileage: formData.get("mileage"),
    engineSize: formData.get("engineSize"),
    fuelType: formData.get("fuelType"),
    transmission: formData.get("transmission"),
    bodyType: formData.get("bodyType"),
    condition: formData.get("condition"),
    status: formData.get("status"),
    description: formData.get("description"),
    featured: formData.get("featured") === "true",
  };

  const result = vehicleSchema.safeParse(raw);
  if (!result.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const data = result.data;
  const slug =
    slugify(data.make, data.model, data.year) + "-" + Date.now().toString(36);

  try {
    const { id } = await repo.createVehicle({
      title: data.title,
      slug,
      make: data.make,
      model: data.model,
      year: data.year,
      price: data.price,
      mileage: data.mileage,
      engine_size: data.engineSize || undefined,
      fuel_type: data.fuelType,
      transmission: data.transmission,
      body_type: data.bodyType,
      condition: data.condition,
      status: data.status,
      description: data.description,
      featured: data.featured,
    });
    revalidatePath("/admin/vehicles");
    revalidatePath("/vehicles");
    return { success: true, message: "Vehicle created successfully.", id };
  } catch (err) {
    console.error("Create vehicle error:", err);
    return { success: false, message: "Failed to create vehicle." };
  }
}

export async function updateVehicleAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    title: formData.get("title"),
    make: formData.get("make"),
    model: formData.get("model"),
    year: formData.get("year"),
    price: formData.get("price"),
    mileage: formData.get("mileage"),
    engineSize: formData.get("engineSize"),
    fuelType: formData.get("fuelType"),
    transmission: formData.get("transmission"),
    bodyType: formData.get("bodyType"),
    condition: formData.get("condition"),
    status: formData.get("status"),
    description: formData.get("description"),
    featured: formData.get("featured") === "true",
  };

  const result = vehicleSchema.safeParse(raw);
  if (!result.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const data = result.data;

  try {
    await repo.updateVehicle(id, {
      title: data.title,
      make: data.make,
      model: data.model,
      year: data.year,
      price: data.price,
      mileage: data.mileage,
      engine_size: data.engineSize || undefined,
      fuel_type: data.fuelType,
      transmission: data.transmission,
      body_type: data.bodyType,
      condition: data.condition,
      status: data.status,
      description: data.description,
      featured: data.featured,
    });
    revalidatePath("/admin/vehicles");
    revalidatePath("/vehicles");
    return { success: true, message: "Vehicle updated successfully.", id };
  } catch (err) {
    console.error("Update vehicle error:", err);
    return { success: false, message: "Failed to update vehicle." };
  }
}

export async function deleteVehicleAction(id: string): Promise<ActionResult> {
  try {
    await repo.deleteVehicle(id);
    revalidatePath("/admin/vehicles");
    revalidatePath("/vehicles");
    return { success: true, message: "Vehicle deleted." };
  } catch (err) {
    console.error("Delete vehicle error:", err);
    return { success: false, message: "Failed to delete vehicle." };
  }
}