import { getFilteredVehicles, getMakes, getEngineSizes } from "@/modules/vehicles/services/vehicle.service";
import { getAllFeatures } from "@/modules/features/repositories/feature.repository";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { VehicleFilter } from "@/components/vehicles/vehicle-filter";
import { parseFiltersFromSearchParams } from "@/lib/filter-utils";

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const filters = parseFiltersFromSearchParams(sp);

  const [vehicles, makes, features, engineSizes] = await Promise.all([
    getFilteredVehicles(filters),
    getMakes(),
    getAllFeatures(),
    getEngineSizes(),
  ]);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Available Vehicles</h1>
        <p className="text-gray-600">
          {vehicles.length} car{vehicles.length === 1 ? "" : "s"} available
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-72 shrink-0">
          <VehicleFilter makes={makes} features={features} engineSizes={engineSizes} />
        </aside>

        <div className="flex-1">
          {vehicles.length === 0 ? (
            <div className="text-center py-20 text-gray-500 bg-white rounded-lg border">
              <p className="text-lg font-medium mb-1">No vehicles match your filters.</p>
              <p className="text-sm">Try adjusting or clearing some filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}