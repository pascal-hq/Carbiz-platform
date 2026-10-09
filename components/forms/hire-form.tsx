"use client";

import { useState, useTransition } from "react";
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
import {
  hireSchema,
  type HireInput,
} from "@/modules/bookings/validators/booking.validator";
import { createHireBooking } from "@/modules/bookings/actions/create-booking.action";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { z } from "zod";

export function HireForm() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
    referenceId?: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<HireInput>({
    resolver: zodResolver(hireSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      pickupLocation: "",
      additionalInfo: "",
    },
  });

  const onSubmit = (data: HireInput) => {
    setStatus(null);

    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("carType", data.carType);
    formData.append("pickupDate", data.pickupDate);
    formData.append("returnDate", data.returnDate);
    formData.append("pickupLocation", data.pickupLocation);
    formData.append("additionalInfo", data.additionalInfo ?? "");

    startTransition(async () => {
      const result = await createHireBooking(formData);

      if (result.success) {
        setStatus({
          type: "success",
          message: result.message,
          referenceId: result.referenceId,
        });
        reset();
      } else {
        setStatus({ type: "error", message: result.message });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
          <div className="text-sm">
            <p>{status.message}</p>
            {status.referenceId && (
              <p className="mt-2 font-mono text-xs opacity-70">
                Reference: {status.referenceId.slice(0, 8).toUpperCase()}
              </p>
            )}
          </div>
        </div>
      )}

      <div>
        <h3 className="font-semibold text-lg mb-3">Your Details</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input id="fullName" {...register("fullName")} placeholder="John Kamau" />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName.message}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" {...register("phone")} />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3">Hire Details</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Car Type *</Label>
            <Select onValueChange={(v) => setValue("carType", v as HireInput["carType"])}>
              <SelectTrigger>
                <SelectValue placeholder="Select car type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sedan">Sedan</SelectItem>
                <SelectItem value="SUV">SUV</SelectItem>
                <SelectItem value="Hatchback">Hatchback</SelectItem>
                <SelectItem value="Luxury">Luxury</SelectItem>
                <SelectItem value="Van">Van / Minibus</SelectItem>
              </SelectContent>
            </Select>
            {errors.carType && (
              <p className="text-red-500 text-sm">{errors.carType.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pickupDate">Pickup Date *</Label>
              <Input id="pickupDate" type="date" {...register("pickupDate")} />
              {errors.pickupDate && (
                <p className="text-red-500 text-sm">{errors.pickupDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="returnDate">Return Date *</Label>
              <Input id="returnDate" type="date" {...register("returnDate")} />
              {errors.returnDate && (
                <p className="text-red-500 text-sm">{errors.returnDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickupLocation">Pickup Location *</Label>
            <Input
              id="pickupLocation"
              {...register("pickupLocation")}
              placeholder="e.g., Nairobi CBD, Westlands, Airport"
            />
            {errors.pickupLocation && (
              <p className="text-red-500 text-sm">{errors.pickupLocation.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalInfo">Additional Requirements (optional)</Label>
        <Textarea
          id="additionalInfo"
          {...register("additionalInfo")}
          rows={3}
          placeholder="Driver needed? Child seat? Specific model?"
        />
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isPending}>
        {isPending ? "Submitting..." : "Request Hire"}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        By submitting, you agree to be contacted with vehicle availability and pricing.
      </p>
    </form>
  );
}