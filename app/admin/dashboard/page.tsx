import Link from "next/link";
import { Car, FileText, Calendar, MessageSquare, Plus } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { SubmissionsChart } from "@/components/dashboard/submissions-chart";
import { RecentSubmissions } from "@/components/dashboard/recent-submissions";
import { getDashboardData } from "@/modules/dashboard/services/dashboard.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboard() {
  const { stats, loans, bookings, inquiries, monthly } = await getDashboardData();

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Overview of your vehicles, applications, and customer activity.
        </p>
      </div>

      {/* Top KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Vehicles"
          value={stats.totalVehicles}
          subtitle={`${stats.availableVehicles} available · ${stats.soldVehicles} sold`}
          icon={Car}
          color="text-blue-600 bg-blue-50"
          href="/admin/vehicles"
        />
        <StatsCard
          title="Loan Applications"
          value={stats.pendingLoans + stats.approvedLoans}
          subtitle={`${stats.pendingLoans} pending · ${stats.approvedLoans} approved`}
          icon={FileText}
          color="text-yellow-600 bg-yellow-50"
          href="/admin/loan-applications"
        />
        <StatsCard
          title="Hire Bookings"
          value={stats.pendingBookings + stats.confirmedBookings}
          subtitle={`${stats.pendingBookings} pending · ${stats.confirmedBookings} confirmed`}
          icon={Calendar}
          color="text-purple-600 bg-purple-50"
          href="/admin/hire-bookings"
        />
        <StatsCard
          title="Inquiries"
          value={stats.totalInquiries}
          subtitle={`${stats.newInquiries} new`}
          icon={MessageSquare}
          color="text-green-600 bg-green-50"
          href="/admin/inquiries"
        />
      </div>

      {/* Chart */}
      <SubmissionsChart data={monthly} />

      {/* Recent Submissions */}
      <div>
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <RecentSubmissions loans={loans} bookings={bookings} inquiries={inquiries} />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/vehicles/create"
            className="p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition text-center"
          >
            <Plus className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="font-medium text-sm">Add Vehicle</p>
          </Link>
          <Link
            href="/admin/loan-applications"
            className="p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition text-center"
          >
            <FileText className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="font-medium text-sm">Review Loans</p>
          </Link>
          <Link
            href="/admin/hire-bookings"
            className="p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition text-center"
          >
            <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="font-medium text-sm">Manage Bookings</p>
          </Link>
          <Link
            href="/admin/inquiries"
            className="p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition text-center"
          >
            <MessageSquare className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="font-medium text-sm">View Inquiries</p>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}