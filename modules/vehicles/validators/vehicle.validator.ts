import { z } from "zod";

export const vehicleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce
    .number()
    .int()
    .min(1900, "Year must be 1900 or later")
    .max(new Date().getFullYear() + 1, "Invalid year"),
  price: z.coerce.number().positive("Price must be positive"),
  mileage: z.coerce.number().int().min(0, "Mileage must be 0 or more"),
  fuelType: z.enum(["Petrol", "Diesel", "Hybrid", "Electric"]),
  transmission: z.enum(["Automatic", "Manual", "CVT"]),
  bodyType: z.enum(["Sedan", "SUV", "Hatchback", "Truck", "Van", "Luxury"]),
  condition: z.enum(["New", "Used"]),
  status: z.enum(["draft", "available", "sold", "archived"]),
  description: z.string().optional(),
  featured: z.boolean().default(false),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;

export function slugify(make: string, model: string, year: number): string {
  return `${make}-${model}-${year}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}