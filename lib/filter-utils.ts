import type { VehicleFilters } from "@/modules/vehicles/repositories/vehicle.repository";

export function parseFiltersFromSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): VehicleFilters {
  const get = (k: string) => {
    const v = searchParams[k];
    return typeof v === "string" ? v : undefined;
  };

  const getNum = (k: string) => {
    const v = get(k);
    if (!v) return undefined;
    const n = Number(v);
    return isNaN(n) ? undefined : n;
  };

  const featuresRaw = searchParams["features"];
  const featureIds =
    typeof featuresRaw === "string"
      ? featuresRaw.split(",").filter(Boolean)
      : Array.isArray(featuresRaw)
      ? featuresRaw
      : [];

  return {
    make: get("make"),
    bodyType: get("body"),
    fuelType: get("fuel"),
    transmission: get("transmission"),
    engineSize: get("engine"),
    condition: get("condition"),
    minPrice: getNum("minPrice"),
    maxPrice: getNum("maxPrice"),
    maxMileage: getNum("maxMileage"),
    featureIds: featureIds.length > 0 ? featureIds : undefined,
  };
}

export function countActiveFilters(
  searchParams: Record<string, string | string[] | undefined>
): number {
  const keys = [
    "make",
    "body",
    "fuel",
    "transmission",
    "engine",
    "condition",
    "minPrice",
    "maxPrice",
    "maxMileage",
    "features",
  ];
  return keys.filter((k) => {
    const v = searchParams[k];
    return typeof v === "string" && v.length > 0;
  }).length;
}