"use server";

import { hireSchema } from "../validators/booking.validator";
import { submitHireBooking } from "../services/booking.service";

export interface BookingActionResult {
  success: boolean;
  message: string;
  referenceId?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function createHireBooking(
  formData: FormData
): Promise<BookingActionResult> {
  const raw = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    carType: formData.get("carType"),
    pickupDate: formData.get("pickupDate"),
    returnDate: formData.get("returnDate"),
    pickupLocation: formData.get("pickupLocation"),
    additionalInfo: formData.get("additionalInfo"),
  };

  const result = hireSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const data = result.data;

  try {
    const { id } = await submitHireBooking({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      carType: data.carType,
      pickupDate: data.pickupDate,
      returnDate: data.returnDate,
      pickupLocation: data.pickupLocation,
      additionalInfo: data.additionalInfo,
    });

    return {
      success: true,
      message:
        "Your hire request has been received. We'll get back to you shortly with available vehicles and pricing.",
      referenceId: id,
    };
  } catch (err) {
    console.error("Hire booking error:", err);
    return {
      success: false,
      message:
        "Something went wrong submitting your request. Please try again or contact us directly.",
    };
  }
}