"use server";

import { submitInquiry } from "../services/inquiry.service";
import { formatPrice } from "@/lib/utils";

export interface CalculatorLeadResult {
  success: boolean;
  message: string;
  whatsappUrl?: string;
}

const WHATSAPP_NUMBER = "254 706432620"; // move to settings later

export async function saveFinancingLead(
  formData: FormData
): Promise<CalculatorLeadResult> {
  const vehiclePrice = Number(formData.get("vehiclePrice") || 0);
  const deposit = Number(formData.get("deposit") || 0);
  const termMonths = Number(formData.get("termMonths") || 0);
  const interestRate = Number(formData.get("interestRate") || 0);
  const monthlyPayment = Number(formData.get("monthlyPayment") || 0);
  const vehicleTitle = String(formData.get("vehicleTitle") || "General inquiry");

  const message = [
    `FINANCING CALCULATION`,
    `Vehicle: ${vehicleTitle}`,
    `Price: ${formatPrice(vehiclePrice)}`,
    `Deposit: ${formatPrice(deposit)}`,
    `Term: ${termMonths} months`,
    `Rate: ${interestRate}% p.a.`,
    `Monthly Payment: ${formatPrice(monthlyPayment)}`,
    ``,
    `Customer requested pre-approval.`,
  ].join("\n");

  try {
    await submitInquiry({
      name: "Website Calculator",
      email: "no-reply@carbiz.co.ke",
      phone: "-",
      subject: `Financing Pre-Approval: ${vehicleTitle}`,
      message,
      type: "financing",
    });

    const waText = encodeURIComponent(
      `Hi, I'd like to get pre-approved for financing.\n\nVehicle: ${vehicleTitle}\nPrice: ${formatPrice(vehiclePrice)}\nDeposit: ${formatPrice(deposit)}\nTerm: ${termMonths} months\nMonthly: ${formatPrice(monthlyPayment)}`
    );

    return {
      success: true,
      message: "Request received! We'll contact you shortly with next steps.",
      whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`,
    };
  } catch (err) {
    console.error("Save financing lead error:", err);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}