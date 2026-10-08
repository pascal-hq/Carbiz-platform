"use server";

import { testDriveSchema } from "../validators/inquiry.validator";
import { submitInquiry } from "../services/inquiry.service";

export interface TestDriveActionResult {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

export async function createTestDriveRequest(
  vehicleId: string,
  vehicleTitle: string,
  formData: FormData
): Promise<TestDriveActionResult> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    preferredDate: formData.get("preferredDate"),
    preferredTime: formData.get("preferredTime"),
    notes: formData.get("notes"),
  };

  const result = testDriveSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const data = result.data;

  const message = [
    `TEST DRIVE REQUEST`,
    `Vehicle: ${vehicleTitle}`,
    `Vehicle ID: ${vehicleId}`,
    ``,
    `Preferred Date: ${data.preferredDate}`,
    `Preferred Time: ${data.preferredTime}`,
    data.notes ? `\nNotes:\n${data.notes}` : "",
  ].join("\n");

  try {
    await submitInquiry({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: `Test Drive: ${vehicleTitle}`,
      message,
      type: "general",
    });

    return {
      success: true,
      message:
        "Your test drive request has been received. We'll confirm your appointment shortly.",
    };
  } catch (err) {
    console.error("Test drive error:", err);
    return {
      success: false,
      message:
        "Something went wrong. Please try again or contact us directly.",
    };
  }
}