"use client";

import { useState } from "react";
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

export function VehicleFilter() {
  const [make, setMake] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleFilter = () => {
    // Will wire to URL query params in next sprint
    console.log({ make, bodyType, minPrice, maxPrice });
  };

  const handleReset = () => {
    setMake("");
    setBodyType("");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className="bg-white p-5 rounded-lg border shadow-sm space-y-4 sticky top-24">
      <h3 className="font-semibold text-lg">Filters</h3>

      <div className="space-y-2">
        <Label>Make</Label>
        <Select value={make} onValueChange={setMake}>
          <SelectTrigger>
            <SelectValue placeholder="Any make" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="toyota">Toyota</SelectItem>
            <SelectItem value="honda">Honda</SelectItem>
            <SelectItem value="mazda">Mazda</SelectItem>
            <SelectItem value="nissan">Nissan</SelectItem>
            <SelectItem value="subaru">Subaru</SelectItem>
            <SelectItem value="mercedes-benz">Mercedes-Benz</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Body Type</Label>
        <Select value={bodyType} onValueChange={setBodyType}>
          <SelectTrigger>
            <SelectValue placeholder="Any type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Sedan">Sedan</SelectItem>
            <SelectItem value="SUV">SUV</SelectItem>
            <SelectItem value="Hatchback">Hatchback</SelectItem>
            <SelectItem value="Truck">Truck</SelectItem>
            <SelectItem value="Van">Van</SelectItem>
            <SelectItem value="Luxury">Luxury</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Min Price</Label>
          <Input
            type="number"
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Max Price</Label>
          <Input
            type="number"
            placeholder="10000000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button onClick={handleFilter} className="flex-1">
          Apply
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}