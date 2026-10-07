"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  loanSchema,
  type LoanInput,
} from "@/modules/loans/validators/loan.validator";
import { createLoanApplication } from "@/modules/loans/actions/create-loan.action";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function LoanForm() {
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
    formState: { errors },
  } = useForm<LoanInput>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      vehicleMake: "",
      vehicleModel: "",
      vehicleYear: new Date().getFullYear() - 3,
      estimatedValue: 0,
      requestedAmount: 0,
      additionalInfo: "",
    },
  });

  const onSubmit = (data: LoanInput) => {
    setStatus(null);

    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("vehicleMake", data.vehicleMake);
    formData.append("vehicleModel", data.vehicleModel);
    formData.append("vehicleYear", String(data.vehicleYear));
    formData.append("estimatedValue", String(data.estimatedValue));
    formData.append("requestedAmount", String(data.requestedAmount));
    formData.append("additionalInfo", data.additionalInfo ?? "");

    startTransition(async () => {
      const result = await createLoanApplication(formData);

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
              <Input id="email" type="email" {...register("email")} placeholder="john@example.com" />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" {...register("phone")} placeholder="+254 700 000 000" />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3">Vehicle Details</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleMake">Car Make *</Label>
              <Input id="vehicleMake" {...register("vehicleMake")} placeholder="Toyota" />
              {errors.vehicleMake && (
                <p className="text-red-500 text-sm">{errors.vehicleMake.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleModel">Car Model *</Label>
              <Input id="vehicleModel" {...register("vehicleModel")} placeholder="Harrier" />
              {errors.vehicleModel && (
                <p className="text-red-500 text-sm">{errors.vehicleModel.message}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleYear">Year *</Label>
              <Input id="vehicleYear" type="number" {...register("vehicleYear")} />
              {errors.vehicleYear && (
                <p className="text-red-500 text-sm">{errors.vehicleYear.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedValue">Estimated Value (KES) *</Label>
              <Input id="estimatedValue" type="number" {...register("estimatedValue")} />
              {errors.estimatedValue && (
                <p className="text-red-500 text-sm">{errors.estimatedValue.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="requestedAmount">Loan Amount (KES) *</Label>
              <Input id="requestedAmount" type="number" {...register("requestedAmount")} />
              {errors.requestedAmount && (
                <p className="text-red-500 text-sm">{errors.requestedAmount.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalInfo">Additional Information (optional)</Label>
        <Textarea
          id="additionalInfo"
          {...register("additionalInfo")}
          rows={3}
          placeholder="Anything else we should know?"
        />
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isPending}>
        {isPending ? "Submitting..." : "Apply for Loan"}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        By submitting, you agree to be contacted by our team regarding your loan application.
      </p>
    </form>
  );
}