"use server";

import { contactSchema } from "../validators/inquiry.validator";
import { submitInquiry } from "../services/inquiry.service";

export interface ContactActionResult {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

export async function createContactInquiry(
  formData: FormData
): Promise<ContactActionResult> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  };

  const result = contactSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const data = result.data;

  try {
    await submitInquiry({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      type: "general",
    });

    return {
      success: true,
      message: "Thank you for reaching out! We'll get back to you within 24 hours.",
    };
  } catch (err) {
    console.error("Contact inquiry error:", err);
    return {
      success: false,
      message:
        "Something went wrong sending your message. Please try again or call us directly.",
    };
  }
}