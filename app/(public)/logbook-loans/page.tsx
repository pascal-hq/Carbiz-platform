import { LoanForm } from "@/components/forms/loan-form";

export const metadata = {
  title: "Logbook Loans - CarBiz",
  description: "Get quick cash against your car logbook.",
};

export default function LogbookLoansPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Logbook Loans</h1>
        <p className="text-gray-600">
          Get quick cash against your vehicle logbook. Fill in the details below
          and we&apos;ll contact you with a loan offer within 24 hours.
        </p>
      </div>
      <LoanForm />
    </div>
  );
}