import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, getPrimaryImage } from "@/lib/utils";

export default async function AdminVehiclesPage() {
  const supabase = await createClient();
  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("*, vehicle_images(*)")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Vehicles</h1>
          <p className="text-gray-600 mt-1">
            {vehicles?.length ?? 0} vehicles in your inventory
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/vehicles/create">
            <Plus className="h-4 w-4 mr-2" /> Add Vehicle
          </Link>
        </Button>
      </div>

      {!vehicles || vehicles.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-gray-500">
            <p>No vehicles yet. Add your first one to get started.</p>
            <Button asChild className="mt-4">
              <Link href="/admin/vehicles/create">Add Vehicle</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <Card key={v.id} className="overflow-hidden">
              <div className="aspect-video bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getPrimaryImage(v.vehicle_images)}
                  alt={`${v.make} ${v.model}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">
                    {v.make} {v.model}
                  </h3>
                  <Badge
                    variant={
                      v.status === "available"
                        ? "default"
                        : v.status === "sold"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {v.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  {v.year} · {v.mileage.toLocaleString()} km · {v.condition}
                </p>
                <p className="font-bold text-primary mb-4">
                  {formatPrice(Number(v.price))}
                </p>

                <div className="grid grid-cols-3 gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/vehicles/${v.id}/edit`}>
                      <Pencil className="h-3 w-3 mr-1" /> Edit
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/vehicles/${v.id}/images`}>
                      Images
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/vehicles/${v.id}/features`}>
                      Features
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}