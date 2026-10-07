import { notFound } from "next/navigation";
import { getVehicleBySlug } from "@/modules/vehicles/services/vehicle.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MessageCircle, Calendar, Gauge, Fuel, Cog } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { VehicleGallery } from "@/components/vehicles/vehicle-gallery";

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) notFound();

  const images = vehicle.vehicle_images ?? [];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Gallery */}
        <div className="lg:col-span-2">
          <VehicleGallery
            images={images}
            alt={`${vehicle.make} ${vehicle.model}`}
          />
        </div>

        {/* Right: Info */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-3">
            <h1 className="text-2xl md:text-3xl font-bold">
              {vehicle.make} {vehicle.model}
            </h1>
            <Badge variant={vehicle.condition === "New" ? "default" : "secondary"}>
              {vehicle.condition}
            </Badge>
          </div>

          <p className="text-3xl font-bold text-primary mb-6">
            {formatPrice(Number(vehicle.price))}
          </p>

          <Card className="mb-6">
            <CardContent className="p-4 grid grid-cols-2 gap-4 text-sm">
              <Spec icon={<Calendar className="h-4 w-4" />} label="Year" value={vehicle.year.toString()} />
              <Spec icon={<Gauge className="h-4 w-4" />} label="Mileage" value={`${vehicle.mileage.toLocaleString()} km`} />
              <Spec icon={<Fuel className="h-4 w-4" />} label="Fuel" value={vehicle.fuel_type} />
              <Spec icon={<Cog className="h-4 w-4" />} label="Transmission" value={vehicle.transmission} />
            </CardContent>
          </Card>

          {vehicle.description && (
            <p className="text-gray-700 mb-6 leading-relaxed">{vehicle.description}</p>
          )}

          <div className="space-y-3">
            <Button className="w-full" size="lg">
              <Phone className="mr-2 h-5 w-5" /> Call Seller
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp Inquiry
            </Button>
            <Button variant="secondary" className="w-full" size="lg">
              <Calendar className="mr-2 h-5 w-5" /> Schedule Test Drive
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-primary">{icon}</span>
      <div>
        <p className="text-gray-500 text-xs">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}