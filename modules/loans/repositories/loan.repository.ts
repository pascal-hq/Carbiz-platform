import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";

export interface CreateLoanData {
  fullName: string;
  email: string;
  phone: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  estimatedValue: number;
  requestedAmount: number;
  additionalInfo?: string;
}

export async function createLoan(
  data: CreateLoanData
): Promise<{ id: string }> {
  const supabase = await createClient();

  // Generate ID client-side so we don't need RETURNING (which would trip RLS).
  const id = randomUUID();

  const { error } = await supabase.from("logbook_loans").insert({
    id,
    full_name: data.fullName,
    email: data.email,
    phone: data.phone,
    vehicle_make: data.vehicleMake,
    vehicle_model: data.vehicleModel,
    vehicle_year: data.vehicleYear,
    estimated_value: data.estimatedValue,
    requested_amount: data.requestedAmount,
    additional_info: data.additionalInfo ?? null,
    status: "pending",
  });

  if (error) {
    console.error("LOAN INSERT ERROR:", JSON.stringify(error, null, 2));
    throw new Error(error.message);
  }

  return { id };
}