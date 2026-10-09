import * as vehicleRepository from "../repositories/vehicle.repository";
import type {
  VehicleWithImages,
  VehicleWithFeatures,
} from "@/types";
import type { VehicleFilters } from "../repositories/vehicle.repository";

/**
 * Get all available vehicles (public listing).
 */
export async function getAvailableVehicles(): Promise<VehicleWithImages[]> {
  return vehicleRepository.findAllAvailable();
}

/**
 * Get featured vehicles (homepage).
 */
export async function getFeaturedVehicles(): Promise<VehicleWithImages[]> {
  return vehicleRepository.findFeatured();
}

/**
 * Get vehicles with filters applied (public listing page).
 */
export async function getFilteredVehicles(filters: VehicleFilters) {
  return vehicleRepository.findWithFilters(filters);
}

/**
 * Get distinct makes for the filter dropdown.
 */
export async function getMakes() {
  return vehicleRepository.getDistinctMakes();
}

/**
 * Get distinct engine sizes for the filter dropdown.
 */
export async function getEngineSizes() {
  return vehicleRepository.getDistinctEngineSizes();
}

/**
 * Get a single vehicle by slug for the detail page.
 * Includes images and features.
 */
export async function getVehicleBySlug(
  slug: string
): Promise<VehicleWithFeatures | null> {
  if (!slug) return null;
  const data = await vehicleRepository.findBySlug(slug);
  return data as VehicleWithFeatures | null;
}

/**
 * Get all vehicles (any status) for the admin panel.
 */
export async function getAllVehiclesForAdmin() {
  return vehicleRepository.findAllForAdmin();
}