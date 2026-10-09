"use client";

import { useState, useMemo, useTransition } from "react";
import { Shield, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  calculateInsurance,
  type InsuranceCover,
  type InsuranceUsage,
} from "@/lib/calculators";
import { formatPrice } from "@/lib/utils";
import { saveInsuranceLead } from "@/modules/inquiries/actions/save-insurance-lead.action";

export function InsuranceCalculator({
  defaultVehicleValue = 0,
  defaultEngineCc = 2000,
  vehicleTitle,
}: {
  defaultVehicleValue?: number;
  defaultEngineCc?: number;
  vehicleTitle?: string;
}) {
  const [vehicleValue, setVehicleValue] = useState(defaultVehicleValue);
  const [engineCapacity, setEngineCapacity] = useState(defaultEngineCc);
  const [coverType, setCoverType] = useState<InsuranceCover>("comprehensive");
  const [usage, setUsage] = useState<InsuranceUsage>("private");
  const [noClaimYears, setNoClaimYears] = useState(0);

  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const result = useMemo(
    () => calculateInsurance({ vehicleValue, engineCapacity, coverType, usage, noClaimYears }),
    [vehicleValue, engineCapacity, coverType, usage, noClaimYears]
  );

  const handleSubmit = () => {
    setStatus(null);
    const fd = new FormData();
    fd.append("vehicleValue", String(vehicleValue));
    fd.append("engineCapacity", String(engineCapacity));
    fd.append("coverType", coverType);
    fd.append("usage", usage);
    fd.append("noClaimYears", String(noClaimYears));
    fd.append("annualPremium", String(result.annualPremium));
    fd.append("vehicleTitle", vehicleTitle ?? "General inquiry");

    startTransition(async () => {
      const res = await saveInsuranceLead(fd);
      if (res.success) {
        setStatus({ type: "success", message: res.message });
        if (res.whatsappUrl) window.open(res.whatsappUrl, "_blank");
      } else {
        setStatus({ type: "error", message: res.message });
      }
    });
  };

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold">Insurance Calculator</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Vehicle Value (KES)</Label>
          <Input
            type="number"
            value={vehicleValue || ""}
            onChange={(e) => setVehicleValue(Number(e.target.value) || 0)}
          />
        </div>

        <div className="space-y-2">
          <Label>Engine Capacity (cc)</Label>
          <Input
            type="number"
            value={engineCapacity || ""}
            onChange={(e) => setEngineCapacity(Number(e.target.value) || 0)}
            placeholder="e.g. 2000"
          />
        </div>

        <div className="space-y-2">
          <Label>Cover Type</Label>
          <Select value={coverType} onValueChange={(v) => setCoverType(v as InsuranceCover)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="comprehensive">Comprehensive</SelectItem>
              <SelectItem value="third_party_fire_theft">Third Party + Fire & Theft</SelectItem>
              <SelectItem value="third_party">Third Party Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Usage</Label>
            <Select value={usage} onValueChange={(v) => setUsage(v as InsuranceUsage)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>No-Claim Years</Label>
            <Select value={String(noClaimYears)} onValueChange={(v) => setNoClaimYears(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3, 4, 5].map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y} {y === 1 ? "year" : "years"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gray-50 border rounded-lg p-4 space-y-3 mt-4">
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-medium">Annual Premium</span>
            <span className="text-2xl font-bold text-primary">
              {formatPrice(result.annualPremium)}
            </span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t text-sm text-gray-600">
            <span>Monthly (÷ 11)</span>
            <span>{formatPrice(result.monthlyPremium)}</span>
          </div>

          <div className="pt-3 border-t space-y-1.5">
            {result.breakdown.map((b, i) => (
              <div key={i} className="flex justify-between text-xs text-gray-600">
                <span>{b.label}</span>
                <span className={b.amount < 0 ? "text-green-600" : ""}>
                  {b.amount < 0 ? "-" : ""}{formatPrice(Math.abs(b.amount))}
                </span>
              </div>
            ))}
          </div>
        </div>

        {status && (
          <div
            className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${
              status.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            )}
            <p>{status.message}</p>
          </div>
        )}

        <Button onClick={handleSubmit} disabled={isPending} className="w-full" size="lg">
          {isPending ? "Submitting..." : "Get Insurance Quote"}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Estimate only. Final premium depends on the insurer.
        </p>
      </div>
    </div>
  );
}