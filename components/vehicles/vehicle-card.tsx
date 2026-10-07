import Link from "next/link";
import { VehicleWithImages } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getPrimaryImage, formatPrice } from "@/lib/utils";

export function VehicleCard({ vehicle }: { vehicle: VehicleWithImages }) {
  const imageUrl = getPrimaryImage(vehicle.vehicle_images);

  return (
    <Link href={`/vehicles/${vehicle.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="aspect-video bg-gray-100 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-semibold line-clamp-1">
              {vehicle.make} {vehicle.model}
            </h3>
            <Badge variant={vehicle.condition === "New" ? "default" : "secondary"}>
              {vehicle.condition}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mb-3">
            {vehicle.year} · {vehicle.mileage.toLocaleString()} km ·{" "}
            {vehicle.transmission}
          </p>
          <p className="text-xl font-bold text-primary">
            {formatPrice(Number(vehicle.price))}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}