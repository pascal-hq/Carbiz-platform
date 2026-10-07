"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sellCarSchema, type SellCarInput } from "@/modules/inquiries/validators/inquiry.validator";
import { createSellCarInquiry } from "@/modules/inquiries/actions/create-inquiry.action";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function SellCarForm() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SellCarInput>({
    resolver: zodResolver(sellCarSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      mileage: 0,
      askingPrice: 0,
      description: "",
    },
  });

  const onSubmit = (data: SellCarInput) => {
    setStatus(null);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("make", data.make);
    formData.append("model", data.model);
    formData.append("year", String(data.year));
    formData.append("mileage", String(data.mileage));
    formData.append("askingPrice", String(data.askingPrice));
    formData.append("description", data.description ?? "");

    startTransition(async () => {
      const result = await createSellCarInquiry(formData);

      if (result.success) {
        setStatus({ type: "success", message: result.message });
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
          <p className="text-sm">{status.message}</p>
        </div>
      )}

      {/* Personal Info */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Your Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" {...register("name")} placeholder="John Kamau" />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" {...register("email")} placeholder="john@example.com" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input id="phone" {...register("phone")} placeholder="+254 700 000 000" />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
        </div>
      </div>

      {/* Car Details */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Vehicle Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="make">Make *</Label>
            <Input id="make" {...register("make")} placeholder="Toyota" />
            {errors.make && <p className="text-red-500 text-sm">{errors.make.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model *</Label>
            <Input id="model" {...register("model")} placeholder="Harrier" />
            {errors.model && <p className="text-red-500 text-sm">{errors.model.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="year">Year *</Label>
            <Input id="year" type="number" {...register("year")} />
            {errors.year && <p className="text-red-500 text-sm">{errors.year.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="mileage">Mileage (km) *</Label>
            <Input id="mileage" type="number" {...register("mileage")} />
            {errors.mileage && <p className="text-red-500 text-sm">{errors.mileage.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="askingPrice">Asking Price (KES) *</Label>
            <Input id="askingPrice" type="number" {...register("askingPrice")} />
            {errors.askingPrice && <p className="text-red-500 text-sm">{errors.askingPrice.message}</p>}
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            {...register("description")}
            rows={4}
            placeholder="Condition, service history, extra features..."
          />
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit for Free Valuation"}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        By submitting, you agree to be contacted by our team regarding your car valuation.
      </p>
    </form>
  );
}