import { z } from "zod";

export const loanSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    vehicleMake: z.string().min(1, "Vehicle make is required"),
    vehicleModel: z.string().min(1, "Vehicle model is required"),
    vehicleYear: z.coerce
      .number()
      .int()
      .min(1900, "Year must be 1900 or later")
      .max(new Date().getFullYear() + 1, "Invalid year"),
    estimatedValue: z.coerce
      .number()
      .positive("Estimated value must be positive"),
    requestedAmount: z.coerce
      .number()
      .positive("Loan amount must be positive"),
    additionalInfo: z.string().optional(),
  })
  .refine((data) => data.requestedAmount <= data.estimatedValue, {
    message: "Loan amount cannot exceed the estimated value",
    path: ["requestedAmount"],
  });

export type LoanInput = z.infer<typeof loanSchema>;