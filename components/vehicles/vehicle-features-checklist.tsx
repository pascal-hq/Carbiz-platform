"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FEATURE_CATEGORIES,
  type Feature,
  type FeatureCategory,
} from "@/types";
import { saveVehicleFeaturesAction } from "@/modules/features/actions/feature.action";

export function VehicleFeaturesChecklist({
  vehicleId,
  allFeatures,
  initialSelected,
  initialExtras,
}: {
  vehicleId: string;
  allFeatures: Feature[];
  initialSelected: string[];
  initialExtras: string;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelected));
  const [extras, setExtras] = useState(initialExtras);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = () => {
    setStatus(null);
    startTransition(async () => {
      const result = await saveVehicleFeaturesAction(
        vehicleId,
        Array.from(selected)
      );
      setStatus({
        type: result.success ? "success" : "error",
        message: result.message,
      });
    });
  };

  const grouped = allFeatures.reduce((acc, f) => {
    const cat = f.category as FeatureCategory;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(f);
    return acc;
  }, {} as Record<FeatureCategory, Feature[]>);

  return (
    <div className="space-y-6">
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

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">{selected.size}</span> of{" "}
          {allFeatures.length} features selected
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setSelected(new Set(allFeatures.map((f) => f.id)))}
          >
            Select all
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setSelected(new Set())}
          >
            Clear
          </Button>
        </div>
      </div>

      {Object.entries(FEATURE_CATEGORIES).map(([catKey, catLabel]) => {
        const features = grouped[catKey as FeatureCategory] ?? [];
        if (features.length === 0) return null;

        return (
          <div key={catKey} className="border rounded-lg p-5 bg-gray-50">
            <h3 className="font-semibold mb-3">{catLabel}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {features.map((f) => (
                <label
                  key={f.id}
                  className="flex items-start gap-2 p-2 rounded hover:bg-white cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    checked={selected.has(f.id)}
                    onChange={() => toggle(f.id)}
                    className="h-4 w-4 mt-0.5 shrink-0 accent-primary"
                  />
                  <span className="text-sm">{f.label}</span>
                </label>
              ))}
            </div>
          </div>
        );
      })}

      <div className="border rounded-lg p-5 bg-gray-50">
        <Label htmlFor="additional_features" className="font-semibold mb-3 block">
          Additional Features (free text)
        </Label>
        <p className="text-xs text-gray-500 mb-3">
          Anything not covered above? Note it here (e.g., custom body kit,
          recent repairs).
        </p>
        <Textarea
          id="additional_features"
          value={extras}
          onChange={(e) => setExtras(e.target.value)}
          rows={3}
          placeholder="e.g. Custom leather steering wheel, recently replaced timing belt..."
        />
      </div>

      <Button type="button" onClick={handleSave} disabled={isPending}>
        {isPending ? "Saving..." : "Save Features"}
      </Button>
    </div>
  );
}