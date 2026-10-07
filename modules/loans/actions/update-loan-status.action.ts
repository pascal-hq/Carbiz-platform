"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const VALID_STATUSES = ["pending", "under_review", "approved", "rejected", "disbursed"] as const;
type LoanStatus = (typeof VALID_STATUSES)[number];

export async function updateLoanStatusAction(id: string, status: string) {
  if (!VALID_STATUSES.includes(status as LoanStatus)) {
    throw new Error("Invalid status");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("logbook_loans")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/loan-applications");
}