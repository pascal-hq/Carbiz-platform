import { getAvailableVehicles } from "@/modules/vehicles/services/vehicle.service";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { VehicleFilter } from "@/components/vehicles/vehicle-filter";

export default async function VehiclesPage() {
  const vehicles = await getAvailableVehicles();

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Available Vehicles</h1>
        <p className="text-gray-600">{vehicles.length} cars available for purchase</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-72 shrink-0">
          <VehicleFilter />
        </aside>

        <div className="flex-1">
          {vehicles.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p>No vehicles available at the moment.</p>
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