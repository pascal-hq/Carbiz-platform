"use client";

import { useState, useTransition, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  sellCarSchema,
  type SellCarInput,
} from "@/modules/inquiries/validators/inquiry.validator";
import { createSellCarInquiry } from "@/modules/inquiries/actions/create-inquiry.action";
import { CheckCircle2, AlertCircle, Upload, X, ImageIcon } from "lucide-react";
import { z } from "zod";

const MAX_PHOTOS = 10;
const MAX_SIZE = 5 * 1024 * 1024;

export function SellCarForm() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    } = useForm<z.input<typeof sellCarSchema>, unknown, z.output<typeof sellCarSchema>>({
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

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setStatus(null);

    const incoming = Array.from(files);
    const next = [...photos];

    for (const f of incoming) {
      if (next.length >= MAX_PHOTOS) {
        setStatus({ type: "error", message: `Maximum ${MAX_PHOTOS} photos allowed.` });
        break;
      }
      if (!f.type.startsWith("image/")) {
        setStatus({ type: "error", message: `"${f.name}" is not an image.` });
        continue;
      }
      if (f.size > MAX_SIZE) {
        setStatus({ type: "error", message: `"${f.name}" exceeds 5MB.` });
        continue;
      }
      next.push(f);
    }

    setPhotos(next);
    setPreviews(next.map((f) => URL.createObjectURL(f)));

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (index: number) => {
    const next = photos.filter((_, i) => i !== index);
    setPhotos(next);
    setPreviews(next.map((f) => URL.createObjectURL(f)));
  };

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
    photos.forEach((p) => formData.append("photos", p));

    startTransition(async () => {
      const result = await createSellCarInquiry(formData);

      if (result.success) {
        setStatus({ type: "success", message: result.message });
        reset();
        setPhotos([]);
        setPreviews([]);
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

      {/* Your Details */}
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

      {/* Vehicle Details */}
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

      {/* Photos */}
      <div>
        <h3 className="font-semibold text-lg mb-3">
          Photos ({photos.length}/{MAX_PHOTOS})
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          Upload clear photos of the exterior, interior, and engine. Max 5MB each.
        </p>

        {previews.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-4">
            {previews.map((src, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden border bg-gray-50 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  aria-label="Remove photo"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {photos.length < MAX_PHOTOS && (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition cursor-pointer"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm font-medium">Click or drag photos here</p>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP · Max 5MB each</p>
          </div>
        )}
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isPending}>
        {isPending
          ? `Submitting${photos.length > 0 ? ` (${photos.length} photo${photos.length > 1 ? "s" : ""})` : ""}...`
          : "Submit for Review"}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Your submission will be reviewed by our team. We&apos;ll contact you within 24 hours.
      </p>
    </form>
  );
}