import { InsuranceCalculator } from "@/components/calculators/insurance-calculator";

export const metadata = {
  title: "Insurance Calculator - CarBiz",
  description: "Estimate your car insurance premium in seconds.",
};

export default function InsuranceCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Insurance Calculator</h1>
        <p className="text-gray-600">
          Get a quick estimate of your annual and monthly insurance premium.
        </p>
      </div>
      <InsuranceCalculator />
    </div>
  );
}