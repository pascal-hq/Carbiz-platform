import { notFound } from "next/navigation";
import { findById } from "@/modules/vehicles/repositories/vehicle.repository";
import { VehicleForm } from "@/components/vehicles/vehicle-form";

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicle = await findById(id);

  if (!vehicle) notFound();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Vehicle</h1>
        <p className="text-gray-600 mt-1">
          {vehicle.make} {vehicle.model} ({vehicle.year})
        </p>
      </div>
      <VehicleForm vehicle={vehicle} />
    </div>
  );
}