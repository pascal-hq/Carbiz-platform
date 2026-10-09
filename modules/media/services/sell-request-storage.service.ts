import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "sell-requests";

export async function uploadSellRequestPhoto(
  inquiryId: string,
  file: File
): Promise<{ path: string; size: number; mimeType: string }> {
  const supabase = createAdminClient();

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").slice(0, 50);
  const path = `${inquiryId}/${crypto.randomUUID()}-${safeName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("SELL REQUEST UPLOAD ERROR:", error);
    throw new Error(error.message);
  }

  return { path, size: file.size, mimeType: file.type };
}

export async function getSignedPhotoUrl(path: string, expiresIn = 3600): Promise<string> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, expiresIn);

  if (error) throw new Error(error.message);
  return data.signedUrl;
}

export async function getSignedPhotoUrls(
  paths: string[],
  expiresIn = 3600
): Promise<Record<string, string>> {
  if (paths.length === 0) return {};
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrls(paths, expiresIn);

  if (error) throw new Error(error.message);

  const map: Record<string, string> = {};
  data?.forEach((item) => {
    if (item.signedUrl) map[item.path] = item.signedUrl;
  });
  return map;
}

/**
 * Copy photos from sell-requests bucket into the public vehicle-images bucket.
 * Returns the new public URLs.
 */
export async function copyPhotosToVehicleBucket(
  paths: string[],
  vehicleId: string
): Promise<{ path: string; publicUrl: string }[]> {
  const supabase = createAdminClient();
  const results: { path: string; publicUrl: string }[] = [];

  for (const srcPath of paths) {
    // Download from sell-requests
    const { data: fileData, error: dlErr } = await supabase.storage
      .from(BUCKET)
      .download(srcPath);

    if (dlErr || !fileData) {
      console.error("Download failed:", srcPath, dlErr);
      continue;
    }

    const ext = srcPath.split(".").pop() ?? "jpg";
    const newPath = `${vehicleId}/${crypto.randomUUID()}.${ext}`;

    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: upErr } = await supabase.storage
      .from("vehicle-images")
      .upload(newPath, buffer, {
        contentType: fileData.type || "image/jpeg",
        upsert: false,
      });

    if (upErr) {
      console.error("Upload failed:", newPath, upErr);
      continue;
    }

    const { data: urlData } = supabase.storage
      .from("vehicle-images")
      .getPublicUrl(newPath);

    results.push({ path: newPath, publicUrl: urlData.publicUrl });
  }

  return results;
}