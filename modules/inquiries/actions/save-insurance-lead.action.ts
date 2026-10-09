"use server";

import { submitInquiry } from "../services/inquiry.service";
import { formatPrice } from "@/lib/utils";

export interface CalculatorLeadResult {
  success: boolean;
  message: string;
  whatsappUrl?: string;
}

const WHATSAPP_NUMBER = "254 706432620";

export async function saveInsuranceLead(
  formData: FormData
): Promise<CalculatorLeadResult> {
  const vehicleValue = Number(formData.get("vehicleValue") || 0);
  const engineCapacity = Number(formData.get("engineCapacity") || 0);
  const coverType = String(formData.get("coverType") || "");
  const usage = String(formData.get("usage") || "");
  const noClaimYears = Number(formData.get("noClaimYears") || 0);
  const annualPremium = Number(formData.get("annualPremium") || 0);
  const vehicleTitle = String(formData.get("vehicleTitle") || "General inquiry");

  const message = [
    `INSURANCE QUOTE REQUEST`,
    `Vehicle: ${vehicleTitle}`,
    `Value: ${formatPrice(vehicleValue)}`,
    `Engine: ${engineCapacity}cc`,
    `Cover: ${coverType}`,
    `Usage: ${usage}`,
    `No-claim years: ${noClaimYears}`,
    `Estimated Annual Premium: ${formatPrice(annualPremium)}`,
    ``,
    `Customer requested an insurance quote.`,
  ].join("\n");

  try {
    await submitInquiry({
      name: "Website Calculator",
      email: "no-reply@carbiz.co.ke",
      phone: "-",
      subject: `Insurance Quote: ${vehicleTitle}`,
      message,
      type: "insurance",
    });

    const waText = encodeURIComponent(
      `Hi, I'd like an insurance quote.\n\nVehicle: ${vehicleTitle}\nValue: ${formatPrice(vehicleValue)}\nCover: ${coverType}\nEstimated Premium: ${formatPrice(annualPremium)}`
    );

    return {
      success: true,
      message: "Quote request received! We'll contact you shortly.",
      whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`,
    };
  } catch (err) {
    console.error("Save insurance lead error:", err);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}