import { SellCarForm } from "@/components/forms/sell-car-form";

export const metadata = {
  title: "Sell Your Car - CarBiz",
  description: "Get a free valuation and sell your car within days.",
};

export default function SellYourCarPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Sell Your Car</h1>
        <p className="text-gray-600">
          Fill in the details below and we&apos;ll contact you within 24 hours with a free valuation.
        </p>
      </div>
      <SellCarForm />
    </div>
  );
}