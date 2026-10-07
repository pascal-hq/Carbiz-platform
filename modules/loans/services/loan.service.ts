import { createLoan, type CreateLoanData } from "../repositories/loan.repository";

export async function submitLoanApplication(data: CreateLoanData) {
  return createLoan(data);
}