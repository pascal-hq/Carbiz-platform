import { VehicleForm } from "@/components/vehicles/vehicle-form";

export default function CreateVehiclePage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add Vehicle</h1>
        <p className="text-gray-600 mt-1">Create a new vehicle listing.</p>
      </div>
      <VehicleForm />
    </div>
  );
}