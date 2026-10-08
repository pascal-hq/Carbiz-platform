import { createClient } from "@/lib/supabase/server";

export interface DashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  soldVehicles: number;
  pendingLoans: number;
  approvedLoans: number;
  pendingBookings: number;
  confirmedBookings: number;
  newInquiries: number;
  totalInquiries: number;
}

export async function getStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const [
    totalVehicles,
    availableVehicles,
    soldVehicles,
    pendingLoans,
    approvedLoans,
    pendingBookings,
    confirmedBookings,
    newInquiries,
    totalInquiries,
  ] = await Promise.all([
    supabase.from("vehicles").select("*", { count: "exact", head: true }),
    supabase.from("vehicles").select("*", { count: "exact", head: true }).eq("status", "available"),
    supabase.from("vehicles").select("*", { count: "exact", head: true }).eq("status", "sold"),
    supabase.from("logbook_loans").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("logbook_loans").select("*", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("hire_bookings").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("hire_bookings").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
    supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("inquiries").select("*", { count: "exact", head: true }),
  ]);

  return {
    totalVehicles: totalVehicles.count ?? 0,
    availableVehicles: availableVehicles.count ?? 0,
    soldVehicles: soldVehicles.count ?? 0,
    pendingLoans: pendingLoans.count ?? 0,
    approvedLoans: approvedLoans.count ?? 0,
    pendingBookings: pendingBookings.count ?? 0,
    confirmedBookings: confirmedBookings.count ?? 0,
    newInquiries: newInquiries.count ?? 0,
    totalInquiries: totalInquiries.count ?? 0,
  };
}

export async function getRecentLoans(limit = 5) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("logbook_loans")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getRecentBookings(limit = 5) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("hire_bookings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getRecentInquiries(limit = 5) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export interface MonthlyData {
  month: string;
  loans: number;
  bookings: number;
  inquiries: number;
}

export async function getMonthlySubmissions(monthsBack = 6): Promise<MonthlyData[]> {
  const supabase = await createClient();

  const since = new Date();
  since.setMonth(since.getMonth() - monthsBack);
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  const [loansRes, bookingsRes, inquiriesRes] = await Promise.all([
    supabase.from("logbook_loans").select("created_at").gte("created_at", since.toISOString()),
    supabase.from("hire_bookings").select("created_at").gte("created_at", since.toISOString()),
    supabase.from("inquiries").select("created_at").gte("created_at", since.toISOString()),
  ]);

  // Build buckets
  const months: MonthlyData[] = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push({
      month: d.toLocaleString("en", { month: "short", year: "2-digit" }),
      loans: 0,
      bookings: 0,
      inquiries: 0,
    });
  }

  const addToBucket = (rows: { created_at: string }[] | null, key: keyof MonthlyData) => {
    if (!rows) return;
    rows.forEach((r) => {
      const d = new Date(r.created_at);
      const label = d.toLocaleString("en", { month: "short", year: "2-digit" });
      const bucket = months.find((m) => m.month === label);
      if (bucket) (bucket[key] as number)++;
    });
  };

  addToBucket(loansRes.data, "loans");
  addToBucket(bookingsRes.data, "bookings");
  addToBucket(inquiriesRes.data, "inquiries");

  return months;
}