import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";

export interface CreateHireBookingData {
  fullName: string;
  email: string;
  phone: string;
  carType: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  additionalInfo?: string;
}

export async function createHireBooking(
  data: CreateHireBookingData
): Promise<{ id: string }> {
  const supabase = await createClient();

  const id = randomUUID();

  const { error } = await supabase.from("hire_bookings").insert({
    id,
    full_name: data.fullName,
    email: data.email,
    phone: data.phone,
    car_type: data.carType,
    pickup_date: data.pickupDate,
    return_date: data.returnDate,
    pickup_location: data.pickupLocation,
    additional_info: data.additionalInfo ?? null,
    status: "pending",
  });

  if (error) {
    console.error("HIRE BOOKING INSERT ERROR:", JSON.stringify(error, null, 2));
    throw new Error(error.message);
  }

  return { id };
}