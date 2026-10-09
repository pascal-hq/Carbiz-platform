"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, AlertCircle } from "lucide-react";
import {
  vehicleSchema,
  type VehicleInput,
} from "@/modules/vehicles/validators/vehicle.validator";
import {
  createVehicleAction,
  updateVehicleAction,
} from "@/modules/vehicles/actions/vehicle.action";
import type { Vehicle } from "@/types";
import { z } from "zod";  

interface VehicleFormProps {
  vehicle?: Vehicle;
}

export function VehicleForm({ vehicle }: VehicleFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    } = useForm<z.input<typeof vehicleSchema>, unknown, z.output<typeof vehicleSchema>>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: vehicle
      ? {
          title: vehicle.title,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          price: Number(vehicle.price),
          mileage: vehicle.mileage,
          engineSize: vehicle.engine_size ?? "",
          fuelType: vehicle.fuel_type as VehicleInput["fuelType"],
          transmission: vehicle.transmission as VehicleInput["transmission"],
          bodyType: vehicle.body_type as VehicleInput["bodyType"],
          condition: vehicle.condition as VehicleInput["condition"],
          status: vehicle.status as VehicleInput["status"],
          description: vehicle.description ?? "",
          featured: vehicle.featured,
        }
      : {
          title: "",
          make: "",
          model: "",
          year: new Date().getFullYear(),
          price: 0,
          mileage: 0,
          engineSize: "",
          fuelType: "Petrol",
          transmission: "Automatic",
          bodyType: "SUV",
          condition: "Used",
          status: "available",
          description: "",
          featured: false,
        },
  });

  const featured = watch("featured");

  const onSubmit = (data: VehicleInput) => {
    setStatus(null);
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.append(k, String(v)));

    startTransition(async () => {
      const result = vehicle
        ? await updateVehicleAction(vehicle.id, fd)
        : await createVehicleAction(fd);

      if (result.success) {
        setStatus({ type: "success", message: result.message });
        setTimeout(() => {
          router.push("/admin/vehicles");
          router.refresh();
        }, 1000);
      } else {
        setStatus({ type: "error", message: result.message });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {status && (
        <div
          className={`flex items-start gap-3 p-4 rounded-lg border ${
            status.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          )}
          <p className="text-sm">{status.message}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label>Title *</Label>
        <Input {...register("title")} placeholder="2020 Toyota Harrier" />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Make *</Label>
          <Input {...register("make")} placeholder="Toyota" />
          {errors.make && (
            <p className="text-red-500 text-sm">{errors.make.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Model *</Label>
          <Input {...register("model")} placeholder="Harrier" />
          {errors.model && (
            <p className="text-red-500 text-sm">{errors.model.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Year *</Label>
          <Input type="number" {...register("year")} />
          {errors.year && (
            <p className="text-red-500 text-sm">{errors.year.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Price (KES) *</Label>
          <Input type="number" {...register("price")} />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Mileage (km) *</Label>
          <Input type="number" {...register("mileage")} />
          {errors.mileage && (
            <p className="text-red-500 text-sm">{errors.mileage.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Engine Size</Label>
        <Input
          {...register("engineSize")}
          placeholder="e.g. 2.0L, 3.5L V6, 1.5L Turbo"
        />
        {errors.engineSize && (
          <p className="text-red-500 text-sm">{errors.engineSize.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Fuel Type *</Label>
          <Select
            defaultValue={vehicle?.fuel_type}
            onValueChange={(v) =>
              setValue("fuelType", v as VehicleInput["fuelType"])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Petrol">Petrol</SelectItem>
              <SelectItem value="Diesel">Diesel</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
              <SelectItem value="Electric">Electric</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Transmission *</Label>
          <Select
            defaultValue={vehicle?.transmission}
            onValueChange={(v) =>
              setValue("transmission", v as VehicleInput["transmission"])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Automatic">Automatic</SelectItem>
              <SelectItem value="Manual">Manual</SelectItem>
              <SelectItem value="CVT">CVT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Body Type *</Label>
          <Select
            defaultValue={vehicle?.body_type}
            onValueChange={(v) =>
              setValue("bodyType", v as VehicleInput["bodyType"])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sedan">Sedan</SelectItem>
              <SelectItem value="SUV">SUV</SelectItem>
              <SelectItem value="Hatchback">Hatchback</SelectItem>
              <SelectItem value="Truck">Truck</SelectItem>
              <SelectItem value="Van">Van</SelectItem>
              <SelectItem value="Luxury">Luxury</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Condition *</Label>
          <Select
            defaultValue={vehicle?.condition}
            onValueChange={(v) =>
              setValue("condition", v as VehicleInput["condition"])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Used">Used</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Status *</Label>
        <Select
          defaultValue={vehicle?.status ?? "available"}
          onValueChange={(v) => setValue("status", v as VehicleInput["status"])}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea {...register("description")} rows={4} />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          checked={featured}
          onChange={(e) => setValue("featured", e.target.checked)}
          className="h-4 w-4"
        />
        <Label htmlFor="featured" className="cursor-pointer">
          Feature this vehicle on the homepage
        </Label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : vehicle ? "Update Vehicle" : "Create Vehicle"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/vehicles")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}