import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { findById } from "@/modules/vehicles/repositories/vehicle.repository";
import {
  getAllFeatures,
  getVehicleFeatureIds,
} from "@/modules/features/repositories/feature.repository";
import { VehicleFeaturesChecklist } from "@/components/vehicles/vehicle-features-checklist";
import { Button } from "@/components/ui/button";

export default async function VehicleFeaturesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [vehicle, allFeatures, selected] = await Promise.all([
    findById(id),
    getAllFeatures(),
    getVehicleFeatureIds(id),
  ]);

  if (!vehicle) notFound();

  return (
    <div className="p-8">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/admin/vehicles">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to vehicles
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Vehicle Features</h1>
        <p className="text-gray-600 mt-1">
          {vehicle.make} {vehicle.model} ({vehicle.year})
        </p>
      </div>

      <div className="max-w-4xl">
        <VehicleFeaturesChecklist
          vehicleId={id}
          allFeatures={allFeatures}
          initialSelected={selected}
          initialExtras={vehicle.additional_features ?? ""}
        />
      </div>
    </div>
  );
}