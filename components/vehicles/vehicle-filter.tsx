"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Filter, X } from "lucide-react";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Feature, FeatureCategory } from "@/types";
import { FEATURE_CATEGORIES } from "@/types";

const BODY_TYPES = ["Sedan", "SUV", "Hatchback", "Truck", "Van", "Luxury"];
const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"];
const TRANSMISSIONS = ["Automatic", "Manual", "CVT"];
const CONDITIONS = ["New", "Used"];

export function VehicleFilter({
  makes,
  features,
  engineSizes,
}: {
  makes: string[];
  features: Feature[];
  engineSizes: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [make, setMake] = useState(searchParams.get("make") ?? "");
  const [body, setBody] = useState(searchParams.get("body") ?? "");
  const [fuel, setFuel] = useState(searchParams.get("fuel") ?? "");
  const [transmission, setTransmission] = useState(
    searchParams.get("transmission") ?? ""
  );
  const [condition, setCondition] = useState(
    searchParams.get("condition") ?? ""
  );
  const [engineSize, setEngineSize] = useState(searchParams.get("engine") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [maxMileage, setMaxMileage] = useState(
    searchParams.get("maxMileage") ?? ""
  );
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    searchParams.get("features")?.split(",").filter(Boolean) ?? []
  );
  const [expandedCat, setExpandedCat] = useState<FeatureCategory | null>(
    "comfort_luxury"
  );

  useEffect(() => {
    setMake(searchParams.get("make") ?? "");
    setBody(searchParams.get("body") ?? "");
    setFuel(searchParams.get("fuel") ?? "");
    setTransmission(searchParams.get("transmission") ?? "");
    setCondition(searchParams.get("condition") ?? "");
    setEngineSize(searchParams.get("engine") ?? "");
    setMinPrice(searchParams.get("minPrice") ?? "");
    setMaxPrice(searchParams.get("maxPrice") ?? "");
    setMaxMileage(searchParams.get("maxMileage") ?? "");
    setSelectedFeatures(
      searchParams.get("features")?.split(",").filter(Boolean) ?? []
    );
  }, [searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (make) params.set("make", make);
    if (body) params.set("body", body);
    if (fuel) params.set("fuel", fuel);
    if (transmission) params.set("transmission", transmission);
    if (condition) params.set("condition", condition);
    if (engineSize) params.set("engine", engineSize);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (maxMileage) params.set("maxMileage", maxMileage);
    if (selectedFeatures.length > 0)
      params.set("features", selectedFeatures.join(","));

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const resetFilters = () => {
    setMake("");
    setBody("");
    setFuel("");
    setTransmission("");
    setCondition("");
    setEngineSize("");
    setMinPrice("");
    setMaxPrice("");
    setMaxMileage("");
    setSelectedFeatures([]);
    startTransition(() => {
      router.push(pathname);
    });
  };

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const activeCount =
    [make, body, fuel, transmission, condition, engineSize, minPrice, maxPrice, maxMileage].filter(
      Boolean
    ).length + (selectedFeatures.length > 0 ? 1 : 0);

  const filterForm = (
    <div className="space-y-5">
      {activeCount > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {activeCount} filter{activeCount > 1 ? "s" : ""} active
          </span>
          <button
            onClick={resetFilters}
            className="text-primary hover:underline flex items-center gap-1"
          >
            <X className="h-3 w-3" /> Clear all
          </button>
        </div>
      )}

      {/* Make */}
      <div className="space-y-2">
        <Label>Make</Label>
        <Select
          value={make || "any"}
          onValueChange={(v) => setMake(v === "any" ? "" : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any make" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any make</SelectItem>
            {makes.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Body Type */}
      <div className="space-y-2">
        <Label>Body Type</Label>
        <Select
          value={body || "any"}
          onValueChange={(v) => setBody(v === "any" ? "" : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any type</SelectItem>
            {BODY_TYPES.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Engine Size */}
      {engineSizes.length > 0 && (
        <div className="space-y-2">
          <Label>Engine Size</Label>
          <Select
            value={engineSize || "any"}
            onValueChange={(v) => setEngineSize(v === "any" ? "" : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              {engineSizes.map((e) => (
                <SelectItem key={e} value={e}>
                  {e}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Fuel & Transmission */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Fuel</Label>
          <Select
            value={fuel || "any"}
            onValueChange={(v) => setFuel(v === "any" ? "" : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              {FUEL_TYPES.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Gearbox</Label>
          <Select
            value={transmission || "any"}
            onValueChange={(v) => setTransmission(v === "any" ? "" : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              {TRANSMISSIONS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Condition */}
      <div className="space-y-2">
        <Label>Condition</Label>
        <Select
          value={condition || "any"}
          onValueChange={(v) => setCondition(v === "any" ? "" : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            {CONDITIONS.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price range */}
      <div className="space-y-2">
        <Label>Price Range (KES)</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      {/* Max mileage */}
      <div className="space-y-2">
        <Label>Max Mileage (km)</Label>
        <Input
          type="number"
          placeholder="e.g. 50000"
          value={maxMileage}
          onChange={(e) => setMaxMileage(e.target.value)}
        />
      </div>

      {/* Features */}
      <div className="space-y-2">
        <Label>Must-Have Features</Label>
        <div className="space-y-2 max-h-72 overflow-y-auto border rounded-lg p-2">
          {Object.entries(FEATURE_CATEGORIES).map(([catKey, catLabel]) => {
            const catFeatures = features.filter((f) => f.category === catKey);
            if (catFeatures.length === 0) return null;
            const isExpanded = expandedCat === catKey;
            const selectedInCat = catFeatures.filter((f) =>
              selectedFeatures.includes(f.id)
            ).length;

            return (
              <div key={catKey} className="border-b last:border-b-0 pb-2 last:pb-0">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedCat(isExpanded ? null : (catKey as FeatureCategory))
                  }
                  className="w-full flex items-center justify-between py-1 text-sm font-medium hover:text-primary"
                >
                  <span>{catLabel}</span>
                  <span className="text-xs text-gray-500">
                    {selectedInCat > 0 && `${selectedInCat} · `}
                    {isExpanded ? "−" : "+"}
                  </span>
                </button>
                {isExpanded && (
                  <div className="pl-1 pt-1 space-y-1">
                    {catFeatures.map((f) => (
                      <label
                        key={f.id}
                        className="flex items-start gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFeatures.includes(f.id)}
                          onChange={() => toggleFeature(f.id)}
                          className="h-3.5 w-3.5 mt-0.5 accent-primary"
                        />
                        <span className="text-xs leading-tight">{f.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Button onClick={applyFilters} disabled={isPending} className="w-full">
        {isPending ? "Applying..." : "Apply Filters"}
      </Button>
    </div>
  );

  return (
    <>
      <div className="hidden md:block bg-white p-5 rounded-lg border shadow-sm sticky top-24">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Filter className="h-4 w-4" /> Filters
        </h3>
        {filterForm}
      </div>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Filters {activeCount > 0 && `(${activeCount})`}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">{filterForm}</div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}