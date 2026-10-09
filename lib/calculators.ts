/**
 * Calculate monthly loan payment using amortization formula.
 * @param principal - Loan amount (vehicle price - deposit)
 * @param annualRatePercent - Annual interest rate (e.g. 14 for 14%)
 * @param termMonths - Loan term in months
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRatePercent: number,
  termMonths: number
): number {
  if (principal <= 0 || termMonths <= 0) return 0;
  const monthlyRate = annualRatePercent / 100 / 12;
  if (monthlyRate === 0) return principal / termMonths;
  const payment =
    (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));
  return Math.round(payment);
}

export interface FinancingResult {
  loanAmount: number;
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
}

export function calculateFinancing(
  vehiclePrice: number,
  deposit: number,
  annualRatePercent: number,
  termMonths: number
): FinancingResult {
  const loanAmount = Math.max(vehiclePrice - deposit, 0);
  const monthlyPayment = calculateMonthlyPayment(
    loanAmount,
    annualRatePercent,
    termMonths
  );
  const totalPaid = monthlyPayment * termMonths;
  const totalInterest = totalPaid - loanAmount;

  return {
    loanAmount: Math.round(loanAmount),
    monthlyPayment: Math.round(monthlyPayment),
    totalPaid: Math.round(totalPaid),
    totalInterest: Math.round(totalInterest),
  };
}

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export function buildAmortizationSchedule(
  principal: number,
  annualRatePercent: number,
  termMonths: number
): AmortizationRow[] {
  if (principal <= 0 || termMonths <= 0) return [];
  const monthlyRate = annualRatePercent / 100 / 12;
  const payment = calculateMonthlyPayment(principal, annualRatePercent, termMonths);
  const rows: AmortizationRow[] = [];
  let balance = principal;

  for (let m = 1; m <= termMonths; m++) {
    const interest = Math.round(balance * monthlyRate);
    const principalPart = Math.round(payment - interest);
    balance = Math.max(balance - principalPart, 0);
    rows.push({
      month: m,
      payment,
      principal: principalPart,
      interest,
      balance,
    });
  }
  return rows;
}

// ============================================================
// INSURANCE CALCULATOR (Kenyan market defaults, IRA-inspired)
// ============================================================

export type InsuranceCover = "comprehensive" | "third_party_fire_theft" | "third_party";
export type InsuranceUsage = "private" | "commercial";

export interface InsuranceInput {
  vehicleValue: number;
  engineCapacity: number; // cc
  coverType: InsuranceCover;
  usage: InsuranceUsage;
  noClaimYears: number; // 0-5
}

export interface InsuranceResult {
  annualPremium: number;
  monthlyPremium: number;
  breakdown: { label: string; amount: number }[];
}

/**
 * Simplified Kenyan insurance premium estimator.
 * Rates are approximate industry averages. Replace with a real
 * underwriter's rate table when the client partners with an insurer.
 */
export function calculateInsurance(input: InsuranceInput): InsuranceResult {
  const { vehicleValue, engineCapacity, coverType, usage, noClaimYears } = input;

  let base = 0;
  const breakdown: { label: string; amount: number }[] = [];

  if (coverType === "comprehensive") {
    // ~5% of vehicle value for private, 6.5% for commercial
    const rate = usage === "commercial" ? 0.065 : 0.05;
    base = vehicleValue * rate;
    breakdown.push({
      label: `Comprehensive (${(rate * 100).toFixed(2)}% of value)`,
      amount: Math.round(base),
    });
  } else if (coverType === "third_party_fire_theft") {
    // Flat + engine capacity factor
    const flat = 15000;
    const ccFactor = (engineCapacity / 1000) * 500;
    base = flat + ccFactor;
    breakdown.push({ label: "Base premium", amount: Math.round(base) });
  } else {
    // Third party only — flat fee scaled lightly by engine capacity
    const flat = 7500;
    const ccFactor = (engineCapacity / 1000) * 200;
    base = flat + ccFactor;
    breakdown.push({ label: "Base premium", amount: Math.round(base) });
  }

  // No-claim discount
  const ncdRate = Math.min(noClaimYears, 5) * 0.05; // 5% per year, max 25%
  const ncdAmount = base * ncdRate;
  if (ncdAmount > 0) {
    breakdown.push({
      label: `No-claim discount (${(ncdRate * 100).toFixed(0)}%)`,
      amount: -Math.round(ncdAmount),
    });
  }

  // Training levy (0.2%) + stamp duty (0.1%) for comprehensive only
  const trainingLevy = coverType === "comprehensive" ? base * 0.002 : 0;
  const stampDuty = coverType === "comprehensive" ? base * 0.001 : 0;
  if (trainingLevy) breakdown.push({ label: "Training levy", amount: Math.round(trainingLevy) });
  if (stampDuty) breakdown.push({ label: "Stamp duty", amount: Math.round(stampDuty) });

  const annual = Math.round(base - ncdAmount + trainingLevy + stampDuty);
  // Monthly = annual / 11 (insurance companies typically charge 12 installments on 11 months)
  const monthly = Math.round(annual / 11);

  return {
    annualPremium: annual,
    monthlyPremium: monthly,
    breakdown,
  };
}