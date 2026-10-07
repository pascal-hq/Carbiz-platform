"use server";

import { sellCarSchema } from "../validators/inquiry.validator";
import { submitInquiry } from "../services/inquiry.service";

export interface ActionResult {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

export async function createSellCarInquiry(
  formData: FormData
): Promise<ActionResult> {
  // 1. Parse & validate
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

  // 2. Compose the message from the form data
  const message = [
    `CAR DETAILS`,
    `Make: ${data.make}`,
    `Model: ${data.model}`,
    `Year: ${data.year}`,
    `Mileage: ${data.mileage.toLocaleString()} km`,
    `Asking Price: KES ${data.askingPrice.toLocaleString()}`,
    data.description ? `\nAdditional Notes:\n${data.description}` : "",
  ].join("\n");

  // 3. Persist
  try {
    await submitInquiry({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: `Sell Car Request - ${data.make} ${data.model} (${data.year})`,
      message,
      type: "sell_car",
    });

    return {
      success: true,
      message: "Thank you! We'll contact you within 24 hours with a valuation.",
    };
  } catch (err) {
    console.error("Sell car inquiry error:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again or contact us directly.",
    };
  }
}