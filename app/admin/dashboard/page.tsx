import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, FileText, Calendar, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [vehiclesRes, loansRes, bookingsRes, inquiriesRes] = await Promise.all([
    supabase.from("vehicles").select("*", { count: "exact", head: true }),
    supabase.from("logbook_loans").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("hire_bookings").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
  ]);

  const stats = [
    {
      title: "Total Vehicles",
      value: vehiclesRes.count ?? 0,
      icon: Car,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Pending Loans",
      value: loansRes.count ?? 0,
      icon: FileText,
      color: "text-yellow-600 bg-yellow-50",
    },
    {
      title: "Pending Bookings",
      value: bookingsRes.count ?? 0,
      icon: Calendar,
      color: "text-purple-600 bg-purple-50",
    },
    {
      title: "New Inquiries",
      value: inquiriesRes.count ?? 0,
      icon: MessageSquare,
      color: "text-green-600 bg-green-50",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back. Here's what's happening.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </span>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="/admin/vehicles/create" className="p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition text-center">
            <Car className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="font-medium text-sm">Add Vehicle</p>
          </a>
          <a href="/admin/loan-applications" className="p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition text-center">
            <FileText className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="font-medium text-sm">Review Loans</p>
          </a>
          <a href="/admin/hire-bookings" className="p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition text-center">
            <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="font-medium text-sm">Manage Bookings</p>
          </a>
          <a href="/admin/inquiries" className="p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition text-center">
            <MessageSquare className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="font-medium text-sm">View Inquiries</p>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}