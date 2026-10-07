import { createClient } from "@/lib/supabase/server";

const BUCKET = "vehicle-images";

export async function uploadVehicleImage(
  vehicleId: string,
  file: File
): Promise<{ path: string; publicUrl: string }> {
  const supabase = await createClient();

  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${vehicleId}/${crypto.randomUUID()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);

  return { path: filename, publicUrl: data.publicUrl };
}

export async function deleteVehicleImageFromStorage(path: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw new Error(error.message);
}