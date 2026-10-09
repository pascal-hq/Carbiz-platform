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
    console.error("INQUIRY INSERT ERROR:", JSON.stringify(error, null, 2));
    throw new Error(error.message);
  }

  return { id };
}

export async function saveInquiryPhotos(
  inquiryId: string,
  photos: { path: string; filename: string; size: number; mimeType: string }[]
): Promise<void> {
  if (photos.length === 0) return;
  const supabase = await createClient();

  const rows = photos.map((p) => ({
    id: randomUUID(),
    inquiry_id: inquiryId,
    path: p.path,
    filename: p.filename,
    size_bytes: p.size,
    mime_type: p.mimeType,
  }));

  const { error } = await supabase.from("inquiry_photos").insert(rows);
  if (error) {
    console.error("INQUIRY PHOTOS INSERT ERROR:", JSON.stringify(error, null, 2));
    throw new Error(error.message);
  }
}

export async function findSellCarRequests() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inquiries")
    .select("*, inquiry_photos(*)")
    .eq("type", "sell_car")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function findInquiryWithPhotos(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inquiries")
    .select("*, inquiry_photos(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateInquiryApproval(
  id: string,
  updates: {
    approved_at?: string;
    approved_by?: string;
    rejection_reason?: string | null;
    vehicle_id?: string | null;
    status?: string;
  }
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").update(updates).eq("id", id);
  if (error) throw new Error(error.message);
}