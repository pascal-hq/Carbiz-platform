import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";

export interface CreateInquiryData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  type: "general" | "sell_car" | "buy_car" | "loan" | "hire";
}

export async function createInquiry(
  data: CreateInquiryData
): Promise<{ id: string }> {
  const supabase = await createClient();

  // Generate the ID here so we don't need .select() to read it back.
  // Anon users have no SELECT policy, so RETURNING would fail RLS.
  const id = randomUUID();

  const { error } = await supabase.from("inquiries").insert({
    id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    subject: data.subject,
    message: data.message,
    type: data.type,
    status: "new",
  });

  if (error) {
    console.error("SUPABASE INSERT ERROR:", JSON.stringify(error, null, 2));
    throw new Error(error.message);
  }

  return { id };
}