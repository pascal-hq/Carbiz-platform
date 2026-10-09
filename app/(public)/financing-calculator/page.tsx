import { FinancingCalculator } from "@/components/calculators/financing-calculator";

export const metadata = {
  title: "Financing Calculator - CarBiz",
  description: "Calculate your monthly car loan payments instantly.",
};

export default function FinancingCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Financing Calculator</h1>
        <p className="text-gray-600">
          See what your monthly car payment could look like. Adjust deposit, term, and rate to fit your budget.
        </p>
      </div>
      <FinancingCalculator />
    </div>
  );
}