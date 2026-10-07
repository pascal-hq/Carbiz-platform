import * as vehicleRepository from "../repositories/vehicle.repository";
import type { VehicleWithImages } from "@/types";

/**
 * Get all available vehicles for the public listing page.
 */
export async function getAvailableVehicles(): Promise<VehicleWithImages[]> {
  return vehicleRepository.findAllAvailable();
}

/**
 * Get featured vehicles for the homepage.
 */
export async function getFeaturedVehicles(): Promise<VehicleWithImages[]> {
  return vehicleRepository.findFeatured();
}

/**
 * Get a single vehicle by slug for the detail page.
 * Returns null if not found.
 */
export async function getVehicleBySlug(
  slug: string
): Promise<VehicleWithImages | null> {
  if (!slug) return null;
  return vehicleRepository.findBySlug(slug);
}

/**
 * Get all vehicles (any status) for the admin panel.
 */
export async function getAllVehiclesForAdmin() {
  return vehicleRepository.findAllForAdmin();
}