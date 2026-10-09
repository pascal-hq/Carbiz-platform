"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  findInquiryWithPhotos,
  updateInquiryApproval,
} from "../repositories/inquiry.repository";
import { copyPhotosToVehicleBucket } from "@/modules/media/services/sell-request-storage.service";
import { slugify } from "@/modules/vehicles/validators/vehicle.validator";
import { randomUUID } from "node:crypto";

export interface ReviewActionResult {
  success: boolean;
  message: string;
  vehicleId?: string;
}

/**
 * Parse the inquiry message to extract car details.
 * Message format from createSellCarInquiry:
 *   CAR DETAILS
 *   Make: Toyota
 *   Model: Harrier
 *   Year: 2020
 *   Mileage: 25,000 km
 *   Asking Price: KES 4,500,000
 *   [Additional Notes: ...]
 */
function parseCarDetails(message: string) {
  const lines = message.split("\n");
  const get = (prefix: string) =>
    lines.find((l) => l.startsWith(prefix))?.replace(prefix, "").trim() ?? "";

  const make = get("Make:");
  const model = get("Model:");
  const year = parseInt(get("Year:"), 10) || new Date().getFullYear();
  const mileage = parseInt(get("Mileage:").replace(/[^0-9]/g, ""), 10) || 0;
  const price = parseFloat(get("Asking Price:").replace(/[^0-9.]/g, "")) || 0;
  const description = get("Additional Notes:") || "";

  return { make, model, year, mileage, price, description };
}

export async function approveSellRequest(
  inquiryId: string
): Promise<ReviewActionResult> {
  const supabase = await createClient();

  // 1. Fetch inquiry + photos
  const inquiry = await findInquiryWithPhotos(inquiryId);
  if (!inquiry) return { success: false, message: "Inquiry not found." };
  if (inquiry.status === "replied") {
    return { success: false, message: "This request has already been approved." };
  }

  const { make, model, year, mileage, price, description } = parseCarDetails(inquiry.message);

  if (!make || !model) {
    return { success: false, message: "Could not parse car make/model from the request." };
  }

  // 2. Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. Create draft vehicle
  const vehicleId = randomUUID();
  const slug = `${slugify(make, model, year)}-${Date.now().toString(36)}`;

  const { error: vErr } = await supabase.from("vehicles").insert({
    id: vehicleId,
    slug,
    title: `${year} ${make} ${model}`,
    make,
    model,
    year,
    price,
    mileage,
    fuel_type: "Petrol",
    transmission: "Automatic",
    body_type: "SUV",
    condition: "Used",
    description,
    status: "draft",
    featured: false,
    additional_features: null,
  });

  if (vErr) {
    console.error("Create draft vehicle error:", vErr);
    return { success: false, message: "Failed to create draft vehicle." };
  }

  // 4. Copy photos from sell-requests to vehicle-images
  const photoPaths = (inquiry.inquiry_photos ?? []).map((p) => p.path);
  if (photoPaths.length > 0) {
    const copied = await copyPhotosToVehicleBucket(photoPaths, vehicleId);

    // Insert vehicle_images rows
    if (copied.length > 0) {
      const rows = copied.map((c, i) => ({
        id: randomUUID(),
        vehicle_id: vehicleId,
        url: c.publicUrl,
        is_primary: i === 0,
        display_order: i,
      }));
      const { error: imgErr } = await supabase.from("vehicle_images").insert(rows);
      if (imgErr) console.error("Insert vehicle_images error:", imgErr);
    }
  }

  // 5. Update inquiry status
  await updateInquiryApproval(inquiryId, {
    approved_at: new Date().toISOString(),
    approved_by: user?.id,
    vehicle_id: vehicleId,
    status: "replied",
  });

  revalidatePath("/admin/sell-requests");
  revalidatePath(`/admin/sell-requests/${inquiryId}`);
  revalidatePath("/admin/vehicles");

  return {
    success: true,
    message: "Approved! A draft vehicle has been created. Edit and publish it from Vehicles.",
    vehicleId,
  };
}

export async function rejectSellRequest(
  inquiryId: string,
  reason: string
): Promise<ReviewActionResult> {
  try {
    await updateInquiryApproval(inquiryId, {
      rejection_reason: reason || "No reason provided",
      status: "closed",
    });

    revalidatePath("/admin/sell-requests");
    revalidatePath(`/admin/sell-requests/${inquiryId}`);

    return { success: true, message: "Request rejected." };
  } catch (err) {
    console.error("Reject error:", err);
    return { success: false, message: "Failed to reject request." };
  }
}