import { randomUUID } from "node:crypto";
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
 * Fetch a single vehicle by slug, with images AND features.
 */
export async function findBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vehicles")
    .select(`
      *,
      vehicle_images(*),
      vehicle_features(*, features(*))
    `)
    .eq("slug", slug)
    .eq("status", "available")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
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

/**
 * Fetch a single vehicle by ID (for admin edit page).
 */
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

// ============================================================
// MUTATIONS
// ============================================================

export interface CreateVehicleData {
  title: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  engine_size?: string;
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

export interface VehicleFilters {
  make?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  condition?: string;
  engineSize?: string;
  minPrice?: number;
  maxPrice?: number;
  maxMileage?: number;
  featureIds?: string[];
}

export async function findWithFilters(
  filters: VehicleFilters
): Promise<VehicleWithImages[]> {
  const supabase = await createClient();

  let query = supabase
    .from("vehicles")
    .select("*, vehicle_images(*)")
    .eq("status", "available")
    .order("created_at", { ascending: false });

  if (filters.make) query = query.eq("make", filters.make);
  if (filters.bodyType) query = query.eq("body_type", filters.bodyType);
  if (filters.fuelType) query = query.eq("fuel_type", filters.fuelType);
  if (filters.transmission) query = query.eq("transmission", filters.transmission);
  if (filters.transmission) query = query.eq("transmission", filters.transmission);
  if (filters.engineSize) query = query.eq("engine_size", filters.engineSize);
  if (filters.condition) query = query.eq("condition", filters.condition);
  if (filters.minPrice !== undefined) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice !== undefined) query = query.lte("price", filters.maxPrice);
  if (filters.maxMileage !== undefined) query = query.lte("mileage", filters.maxMileage);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  let results = (data as VehicleWithImages[]) ?? [];

  // Feature filter — must have ALL selected features (AND semantics)
  if (filters.featureIds && filters.featureIds.length > 0) {
    const { data: matches, error: fErr } = await supabase
      .from("vehicle_features")
      .select("vehicle_id, feature_id")
      .in("feature_id", filters.featureIds)
      .eq("enabled", true);

    if (fErr) throw new Error(fErr.message);

    // Count how many of the requested features each vehicle has
    const counts: Record<string, number> = {};
    (matches ?? []).forEach((m) => {
      counts[m.vehicle_id] = (counts[m.vehicle_id] ?? 0) + 1;
    });

    const required = filters.featureIds.length;
    const vehicleIdsWithAll = new Set(
      Object.entries(counts)
        .filter(([, c]) => c === required)
        .map(([id]) => id)
    );

    results = results.filter((v) => vehicleIdsWithAll.has(v.id));
  }

  return results;
}

export async function getDistinctMakes(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("make")
    .eq("status", "available");
  if (error) throw new Error(error.message);
  const unique = new Set((data ?? []).map((r) => r.make));
  return Array.from(unique).sort();
}

export async function getDistinctEngineSizes(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("engine_size")
    .eq("status", "available")
    .not("engine_size", "is", null);
  if (error) throw new Error(error.message);
  const unique = new Set(
    (data ?? []).map((r) => r.engine_size).filter((e): e is string => !!e)
  );
  return Array.from(unique).sort();
}