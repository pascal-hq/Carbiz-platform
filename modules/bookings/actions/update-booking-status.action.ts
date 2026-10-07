"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const VALID_STATUSES = ["pending", "confirmed", "ongoing", "completed", "cancelled"] as const;
type BookingStatus = (typeof VALID_STATUSES)[number];

export async function updateBookingStatusAction(id: string, status: string) {
  if (!VALID_STATUSES.includes(status as BookingStatus)) {
    throw new Error("Invalid status");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("hire_bookings")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/hire-bookings");
}