import { z } from "zod";

export const hireSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    carType: z.enum(["Sedan", "SUV", "Hatchback", "Luxury", "Van"], {
      message: "Please select a car type",
    }),
    pickupDate: z.string().min(1, "Pickup date is required"),
    returnDate: z.string().min(1, "Return date is required"),
    pickupLocation: z.string().min(2, "Pickup location is required"),
    additionalInfo: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.pickupDate || !data.returnDate) return true;
      return new Date(data.returnDate) >= new Date(data.pickupDate);
    },
    {
      message: "Return date must be on or after pickup date",
      path: ["returnDate"],
    }
  )
  .refine(
    (data) => {
      if (!data.pickupDate) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(data.pickupDate) >= today;
    },
    {
      message: "Pickup date cannot be in the past",
      path: ["pickupDate"],
    }
  );

export type HireInput = z.infer<typeof hireSchema>;