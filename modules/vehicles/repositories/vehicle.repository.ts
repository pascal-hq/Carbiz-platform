import { createClient } from "@/lib/supabase/server";
import type { Vehicle, VehicleWithImages } from "@/types";

/**
 * Fetch all available vehicles with their images.
 */
export async function findAllAvailable(): Promise<VehicleWithImages[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vehicles")
    .select("*, vehicle_images(*)")
    .eq("status", "available")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as VehicleWithImages[]) ?? [];
}

/**
 * Fetch featured vehicles only.
 */
export async function findFeatured(): Promise<VehicleWithImages[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vehicles")
    .select("*, vehicle_images(*)")
    .eq("status", "available")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) throw new Error(error.message);
  return (data as VehicleWithImages[]) ?? [];
}

/**
 * Fetch a single vehicle by slug, with images.
 */
export async function findBySlug(slug: string): Promise<VehicleWithImages | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vehicles")
    .select("*, vehicle_images(*)")
    .eq("slug", slug)
    .eq("status", "available")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as VehicleWithImages | null;
}

/**
 * Fetch all vehicles for admin (any status).
 */
export async function findAllForAdmin(): Promise<Vehicle[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}


import { randomUUID } from "node:crypto";

export interface CreateVehicleData {
  title: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  body_type: string;
  condition: string;
  status: string;
  description?: string;
  featured: boolean;
}

export async function createVehicle(
  data: CreateVehicleData
): Promise<{ id: string }> {
  const supabase = await createClient();
  const id = randomUUID();

  const { error } = await supabase.from("vehicles").insert({
    id,
    ...data,
  });

  if (error) throw new Error(error.message);
  return { id };
}

export async function updateVehicle(
  id: string,
  data: Partial<CreateVehicleData>
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("vehicles").update(data).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteVehicle(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("vehicles").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function findById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*, vehicle_images(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}