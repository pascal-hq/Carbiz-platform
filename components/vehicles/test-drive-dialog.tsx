"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import {
  testDriveSchema,
  type TestDriveInput,
} from "@/modules/inquiries/validators/inquiry.validator";
import { createTestDriveRequest } from "@/modules/inquiries/actions/create-test-drive.action";

export function TestDriveDialog({
  vehicleId,
  vehicleTitle,
}: {
  vehicleId: string;
  vehicleTitle: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TestDriveInput>({
    resolver: zodResolver(testDriveSchema),
  });

  const onSubmit = (data: TestDriveInput) => {
    setStatus(null);

    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("email", data.email);
    fd.append("phone", data.phone);
    fd.append("preferredDate", data.preferredDate);
    fd.append("preferredTime", data.preferredTime);
    fd.append("notes", data.notes ?? "");

    startTransition(async () => {
      const result = await createTestDriveRequest(vehicleId, vehicleTitle, fd);
      if (result.success) {
        setStatus({ type: "success", message: result.message });
        reset();
        setTimeout(() => {
          setOpen(false);
          setStatus(null);
        }, 2500);
      } else {
        setStatus({ type: "error", message: result.message });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full" size="lg">
          <Calendar className="mr-2 h-5 w-5" /> Schedule Test Drive
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule a Test Drive</DialogTitle>
          <DialogDescription>{vehicleTitle}</DialogDescription>
        </DialogHeader>

        {status ? (
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
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="td-name">Full Name *</Label>
              <Input id="td-name" {...register("name")} />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="td-email">Email *</Label>
                <Input id="td-email" type="email" {...register("email")} />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="td-phone">Phone *</Label>
                <Input id="td-phone" {...register("phone")} />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="td-date">Preferred Date *</Label>
                <Input id="td-date" type="date" {...register("preferredDate")} />
                {errors.preferredDate && (
                  <p className="text-red-500 text-sm">
                    {errors.preferredDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="td-time">Preferred Time *</Label>
                <Input id="td-time" type="time" {...register("preferredTime")} />
                {errors.preferredTime && (
                  <p className="text-red-500 text-sm">
                    {errors.preferredTime.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="td-notes">Notes (optional)</Label>
              <Textarea id="td-notes" {...register("notes")} rows={2} />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Submitting..." : "Request Test Drive"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}