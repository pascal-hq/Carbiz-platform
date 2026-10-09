import { notFound } from "next/navigation";
import { getVehicleBySlug } from "@/modules/vehicles/services/vehicle.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Phone,
  MessageCircle,
  Calendar,
  Gauge,
  Fuel,
  Cog,
  CheckCircle2,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { VehicleGallery } from "@/components/vehicles/vehicle-gallery";
import { TestDriveDialog } from "@/components/vehicles/test-drive-dialog";
import { FEATURE_CATEGORIES } from "@/types";

const SELLER_PHONE = "+254 706432620";
const SELLER_WHATSAPP = "254706432620";

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) notFound();

  const images = vehicle.vehicle_images ?? [];
  const features = vehicle.vehicle_features ?? [];
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in the ${title} listed at ${formatPrice(Number(vehicle.price))}.`
  );
  const whatsappUrl = `https://wa.me/${SELLER_WHATSAPP}?text=${whatsappMessage}`;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Gallery + Features */}
        <div className="lg:col-span-2 space-y-8">
          <VehicleGallery images={images} alt={title} />

          {features.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Features &amp; Options</h2>
              <div className="space-y-5">
                {Object.entries(FEATURE_CATEGORIES).map(([catKey, catLabel]) => {
                  const feats = features.filter(
                    (vf) => vf.features && vf.features.category === catKey
                  );
                  if (feats.length === 0) return null;
                  return (
                    <div key={catKey}>
                      <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wide mb-2">
                        {catLabel}
                      </h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                        {feats.map((vf) => (
                          <li
                            key={vf.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                            <span>{vf.features.label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {vehicle.additional_features && (
                <div className="mt-5 p-4 bg-gray-50 rounded-lg border">
                  <h3 className="font-semibold text-sm mb-2">
                    Additional Notes
                  </h3>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {vehicle.additional_features}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Info + CTA */}
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
              <Spec
                icon={<Calendar className="h-4 w-4" />}
                label="Year"
                value={vehicle.year.toString()}
              />
              <Spec
                icon={<Gauge className="h-4 w-4" />}
                label="Mileage"
                value={`${vehicle.mileage.toLocaleString()} km`}
              />
              <Spec
                icon={<Fuel className="h-4 w-4" />}
                label="Fuel"
                value={vehicle.fuel_type}
              />
              <Spec
                icon={<Cog className="h-4 w-4" />}
                label="Transmission"
                value={vehicle.transmission}
              />
              {vehicle.engine_size && (
                <Spec
                  icon={<Cog className="h-4 w-4" />}
                  label="Engine"
                  value={vehicle.engine_size}
                />
              )}
            </CardContent>
          </Card>

          {vehicle.description && (
            <p className="text-gray-700 mb-6 leading-relaxed">
              {vehicle.description}
            </p>
          )}

          <div className="space-y-3">
            <Button asChild className="w-full" size="lg">
              <a href={`tel:${SELLER_PHONE}`}>
                <Phone className="mr-2 h-5 w-5" /> Call Seller
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full" size="lg">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp Inquiry
              </a>
            </Button>
            <TestDriveDialog vehicleId={vehicle.id} vehicleTitle={title} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
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