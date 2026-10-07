import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";

export async function createVehicleImage(
  vehicleId: string,
  url: string,
  isPrimary: boolean,
  displayOrder: number
): Promise<{ id: string }> {
  const supabase = await createClient();
  const id = randomUUID();

  const { error } = await supabase.from("vehicle_images").insert({
    id,
    vehicle_id: vehicleId,
    url,
    is_primary: isPrimary,
    display_order: displayOrder,
  });

  if (error) throw new Error(error.message);
  return { id };
}

export async function getVehicleImages(vehicleId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicle_images")
    .select("*")
    .eq("vehicle_id", vehicleId)
    .order("display_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function deleteVehicleImage(id: string) {
  const supabase = await createClient();
  const { data: img } = await supabase
    .from("vehicle_images")
    .select("url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("vehicle_images").delete().eq("id", id);
  if (error) throw new Error(error.message);

  return img?.url;
}

export async function setPrimaryImage(vehicleId: string, imageId: string) {
  const supabase = await createClient();

  // Clear all
  await supabase
    .from("vehicle_images")
    .update({ is_primary: false })
    .eq("vehicle_id", vehicleId);

  // Set one
  const { error } = await supabase
    .from("vehicle_images")
    .update({ is_primary: true })
    .eq("id", imageId);

  if (error) throw new Error(error.message);
}

export async function countVehicleImages(vehicleId: string): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("vehicle_images")
    .select("*", { count: "exact", head: true })
    .eq("vehicle_id", vehicleId);
  return count ?? 0;
}