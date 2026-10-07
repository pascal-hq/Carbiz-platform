import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { findById } from "@/modules/vehicles/repositories/vehicle.repository";
import { getVehicleImages } from "@/modules/media/repositories/image.repository";
import { ImageUploader } from "@/components/vehicles/image-uploader";
import { Button } from "@/components/ui/button";

export default async function VehicleImagesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [vehicle, images] = await Promise.all([
    findById(id),
    getVehicleImages(id),
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
        <h1 className="text-3xl font-bold">Manage Images</h1>
        <p className="text-gray-600 mt-1">
          {vehicle.make} {vehicle.model} ({vehicle.year})
        </p>
      </div>

      <div className="max-w-3xl">
        <ImageUploader vehicleId={id} initialImages={images} />
      </div>
    </div>
  );
}