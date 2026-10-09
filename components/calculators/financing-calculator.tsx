"use client";

import { useState, useMemo, useTransition } from "react";
import { Calculator, ChevronDown, ChevronUp, CheckCircle2, AlertCircle } from "lucide-react";
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
  calculateFinancing,
  buildAmortizationSchedule,
} from "@/lib/calculators";
import { formatPrice } from "@/lib/utils";
import { saveFinancingLead } from "@/modules/inquiries/actions/save-financing-lead.action";

const TERMS = [12, 24, 36, 48, 60];

export function FinancingCalculator({
  defaultVehiclePrice = 0,
  vehicleTitle,
}: {
  defaultVehiclePrice?: number;
  vehicleTitle?: string;
}) {
  const [vehiclePrice, setVehiclePrice] = useState(defaultVehiclePrice);
  const [depositPercent, setDepositPercent] = useState(20);
  const [termMonths, setTermMonths] = useState(36);
  const [interestRate, setInterestRate] = useState(14);
  const [showSchedule, setShowSchedule] = useState(false);

  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const deposit = Math.round((vehiclePrice * depositPercent) / 100);

  const result = useMemo(
    () => calculateFinancing(vehiclePrice, deposit, interestRate, termMonths),
    [vehiclePrice, deposit, interestRate, termMonths]
  );

  const schedule = useMemo(
    () =>
      showSchedule
        ? buildAmortizationSchedule(result.loanAmount, interestRate, termMonths)
        : [],
    [showSchedule, result.loanAmount, interestRate, termMonths]
  );

  const handleSubmit = () => {
    setStatus(null);
    const fd = new FormData();
    fd.append("vehiclePrice", String(vehiclePrice));
    fd.append("deposit", String(deposit));
    fd.append("termMonths", String(termMonths));
    fd.append("interestRate", String(interestRate));
    fd.append("monthlyPayment", String(result.monthlyPayment));
    fd.append("vehicleTitle", vehicleTitle ?? "General inquiry");

    startTransition(async () => {
      const res = await saveFinancingLead(fd);
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
        <Calculator className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold">Financing Calculator</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Vehicle Price (KES)</Label>
          <Input
            type="number"
            value={vehiclePrice || ""}
            onChange={(e) => setVehiclePrice(Number(e.target.value) || 0)}
            placeholder="4,500,000"
          />
        </div>

        <div className="space-y-2">
          <Label>Deposit: {depositPercent}% · {formatPrice(deposit)}</Label>
          <input
            type="range"
            min={0}
            max={80}
            step={5}
            value={depositPercent}
            onChange={(e) => setDepositPercent(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Term</Label>
            <Select
              value={String(termMonths)}
              onValueChange={(v) => setTermMonths(Number(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TERMS.map((t) => (
                  <SelectItem key={t} value={String(t)}>
                    {t} months
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Interest Rate (% p.a.)</Label>
            <Input
              type="number"
              step="0.5"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Results */}
        <div className="bg-gray-50 border rounded-lg p-4 space-y-3 mt-4">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-gray-600">Loan Amount</span>
            <span className="font-semibold">{formatPrice(result.loanAmount)}</span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t">
            <span className="text-sm font-medium">Monthly Payment</span>
            <span className="text-2xl font-bold text-primary">
              {formatPrice(result.monthlyPayment)}
            </span>
          </div>
          <div className="flex justify-between items-baseline text-sm text-gray-600">
            <span>Total Interest</span>
            <span>{formatPrice(result.totalInterest)}</span>
          </div>
          <div className="flex justify-between items-baseline text-sm text-gray-600">
            <span>Total Cost</span>
            <span>{formatPrice(result.totalPaid + deposit)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowSchedule(!showSchedule)}
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          {showSchedule ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {showSchedule ? "Hide" : "Show"} amortization schedule
        </button>

        {showSchedule && (
          <div className="max-h-64 overflow-y-auto border rounded-lg">
            <table className="w-full text-xs">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="p-2 text-left">Mo</th>
                  <th className="p-2 text-right">Payment</th>
                  <th className="p-2 text-right">Principal</th>
                  <th className="p-2 text-right">Interest</th>
                  <th className="p-2 text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={row.month} className="border-t">
                    <td className="p-2">{row.month}</td>
                    <td className="p-2 text-right">{row.payment.toLocaleString()}</td>
                    <td className="p-2 text-right">{row.principal.toLocaleString()}</td>
                    <td className="p-2 text-right">{row.interest.toLocaleString()}</td>
                    <td className="p-2 text-right">{row.balance.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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
          {isPending ? "Submitting..." : "Get Pre-Approved"}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Estimate only. Final terms depend on lender approval.
        </p>
      </div>
    </div>
  );
}