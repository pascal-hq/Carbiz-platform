"use server";

import { loanSchema } from "../validators/loan.validator";
import { submitLoanApplication } from "../services/loan.service";

export interface LoanActionResult {
  success: boolean;
  message: string;
  referenceId?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function createLoanApplication(
  formData: FormData
): Promise<LoanActionResult> {
  const raw = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    vehicleMake: formData.get("vehicleMake"),
    vehicleModel: formData.get("vehicleModel"),
    vehicleYear: formData.get("vehicleYear"),
    estimatedValue: formData.get("estimatedValue"),
    requestedAmount: formData.get("requestedAmount"),
    additionalInfo: formData.get("additionalInfo"),
  };

  const result = loanSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const data = result.data;

  try {
    const { id } = await submitLoanApplication({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      vehicleMake: data.vehicleMake,
      vehicleModel: data.vehicleModel,
      vehicleYear: data.vehicleYear,
      estimatedValue: data.estimatedValue,
      requestedAmount: data.requestedAmount,
      additionalInfo: data.additionalInfo,
    });

    return {
      success: true,
      message:
        "Your loan application has been received. Our team will contact you within 24 hours with an offer.",
      referenceId: id,
    };
  } catch (err) {
    console.error("Loan application error:", err);
    return {
      success: false,
      message:
        "Something went wrong submitting your application. Please try again or contact us directly.",
    };
  }
}