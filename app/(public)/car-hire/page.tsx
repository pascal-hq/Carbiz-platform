import { HireForm } from "@/components/forms/hire-form";

export const metadata = {
  title: "Car Hire - CarBiz",
  description: "Rent a car for any occasion. Flexible daily, weekly, and monthly rates.",
};

export default function CarHirePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Car Hire</h1>
        <p className="text-gray-600">
          Rent a car for your journey. Fill in the details below and we&apos;ll
          get back to you with available vehicles and rates.
        </p>
      </div>
      <HireForm />
    </div>
  );
}