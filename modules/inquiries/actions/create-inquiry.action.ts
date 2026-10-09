"use server";

import { sellCarSchema } from "../validators/inquiry.validator";
import { createInquiry, saveInquiryPhotos } from "../repositories/inquiry.repository";
import { uploadSellRequestPhoto } from "@/modules/media/services/sell-request-storage.service";

export interface ActionResult {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

const MAX_PHOTOS = 10;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function createSellCarInquiry(
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    make: formData.get("make"),
    model: formData.get("model"),
    year: formData.get("year"),
    mileage: formData.get("mileage"),
    askingPrice: formData.get("askingPrice"),
    description: formData.get("description"),
  };

  const result = sellCarSchema.safeParse(raw);
  if (!result.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const data = result.data;

  // Extract photos from formData
  const photos = formData.getAll("photos") as File[];
  const validPhotos = photos.filter((f) => f && f.size > 0);

  // Validate photo count + size
  if (validPhotos.length > MAX_PHOTOS) {
    return {
      success: false,
      message: `You can upload up to ${MAX_PHOTOS} photos.`,
    };
  }

  for (const p of validPhotos) {
    if (p.size > MAX_SIZE) {
      return {
        success: false,
        message: `"${p.name}" exceeds the 5MB limit.`,
      };
    }
    if (!p.type.startsWith("image/")) {
      return {
        success: false,
        message: `"${p.name}" is not an image file.`,
      };
    }
  }

  const message = [
    `CAR DETAILS`,
    `Make: ${data.make}`,
    `Model: ${data.model}`,
    `Year: ${data.year}`,
    `Mileage: ${data.mileage.toLocaleString()} km`,
    `Asking Price: KES ${data.askingPrice.toLocaleString()}`,
    data.description ? `\nAdditional Notes:\n${data.description}` : "",
  ].join("\n");

  try {
    // 1. Create the inquiry
    const { id: inquiryId } = await createInquiry({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: `Sell Car Request - ${data.make} ${data.model} (${data.year})`,
      message,
      type: "sell_car",
    });

    // 2. Upload photos + save rows
    if (validPhotos.length > 0) {
      const uploaded = [];
      for (const file of validPhotos) {
        const r = await uploadSellRequestPhoto(inquiryId, file);
        uploaded.push({
          path: r.path,
          filename: file.name,
          size: r.size,
          mimeType: r.mimeType,
        });
      }
      await saveInquiryPhotos(inquiryId, uploaded);
    }

    return {
      success: true,
      message: `Thank you! Your car details${validPhotos.length > 0 ? ` and ${validPhotos.length} photo${validPhotos.length > 1 ? "s" : ""}` : ""} have been received. We'll review and get back to you within 24 hours.`,
    };
  } catch (err) {
    console.error("Sell car inquiry error:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again or contact us directly.",
    };
  }
}