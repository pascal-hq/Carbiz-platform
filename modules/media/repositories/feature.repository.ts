import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import type { Feature } from "@/types";

export async function getAllFeatures(): Promise<Feature[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("features")
    .select("*")
    .order("category")
    .order("display_order");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getVehicleFeatureIds(vehicleId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicle_features")
    .select("feature_id")
    .eq("vehicle_id", vehicleId)
    .eq("enabled", true);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => r.feature_id);
}

export async function getVehicleFeatures(vehicleId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicle_features")
    .select("*, features(*)")
    .eq("vehicle_id", vehicleId)
    .eq("enabled", true);
  if (error) throw new Error(error.message);
  return data ?? [];
}

/**
 * Replaces all features for a vehicle with the given list of feature IDs.
 */
export async function setVehicleFeatures(
  vehicleId: string,
  featureIds: string[]
): Promise<void> {
  const supabase = await createClient();

  // Delete existing
  const { error: delError } = await supabase
    .from("vehicle_features")
    .delete()
    .eq("vehicle_id", vehicleId);
  if (delError) throw new Error(delError.message);

  if (featureIds.length === 0) return;

  const rows = featureIds.map((fid) => ({
    id: randomUUID(),
    vehicle_id: vehicleId,
    feature_id: fid,
    enabled: true,
  }));

  const { error: insError } = await supabase.from("vehicle_features").insert(rows);
  if (insError) throw new Error(insError.message);
}