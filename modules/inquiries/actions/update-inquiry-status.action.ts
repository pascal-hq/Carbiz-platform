"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const VALID_STATUSES = ["new", "read", "replied", "closed"] as const;
type InquiryStatus = (typeof VALID_STATUSES)[number];

export async function updateInquiryStatusAction(id: string, status: string) {
  if (!VALID_STATUSES.includes(status as InquiryStatus)) {
    throw new Error("Invalid status");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("inquiries")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/inquiries");
}