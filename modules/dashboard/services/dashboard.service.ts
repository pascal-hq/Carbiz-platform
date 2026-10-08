import * as repo from "../repositories/dashboard.repository";

export async function getDashboardData() {
  const [stats, loans, bookings, inquiries, monthly] = await Promise.all([
    repo.getStats(),
    repo.getRecentLoans(5),
    repo.getRecentBookings(5),
    repo.getRecentInquiries(5),
    repo.getMonthlySubmissions(6),
  ]);

  return { stats, loans, bookings, inquiries, monthly };
}