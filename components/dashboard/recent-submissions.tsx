import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import type { LogbookLoan, HireBooking, Inquiry } from "@/types";

const loanStatusColor: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  under_review: "outline",
  approved: "default",
  rejected: "destructive",
  disbursed: "default",
};

const bookingStatusColor: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  confirmed: "default",
  ongoing: "outline",
  completed: "default",
  cancelled: "destructive",
};

const inquiryStatusColor: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  new: "secondary",
  read: "outline",
  replied: "default",
  closed: "destructive",
};

export function RecentSubmissions({
  loans,
  bookings,
  inquiries,
}: {
  loans: LogbookLoan[];
  bookings: HireBooking[];
  inquiries: Inquiry[];
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recent Loans */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Loan Applications</CardTitle>
          <Link
            href="/admin/loan-applications"
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent>
          {loans.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No applications yet.</p>
          ) : (
            <ul className="space-y-3">
              {loans.map((loan) => (
                <li key={loan.id} className="flex items-start justify-between gap-2 border-b pb-3 last:border-b-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{loan.full_name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {loan.vehicle_make} {loan.vehicle_model} · KES{" "}
                      {Number(loan.requested_amount).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant={loanStatusColor[loan.status] ?? "secondary"} className="text-xs shrink-0">
                    {loan.status.replace("_", " ")}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Hire Bookings</CardTitle>
          <Link
            href="/admin/hire-bookings"
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No bookings yet.</p>
          ) : (
            <ul className="space-y-3">
              {bookings.map((b) => (
                <li key={b.id} className="flex items-start justify-between gap-2 border-b pb-3 last:border-b-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{b.full_name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {b.car_type} · {new Date(b.pickup_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={bookingStatusColor[b.status] ?? "secondary"} className="text-xs shrink-0">
                    {b.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Recent Inquiries */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Inquiries</CardTitle>
          <Link
            href="/admin/inquiries"
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent>
          {inquiries.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No inquiries yet.</p>
          ) : (
            <ul className="space-y-3">
              {inquiries.map((inq) => (
                <li key={inq.id} className="flex items-start justify-between gap-2 border-b pb-3 last:border-b-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{inq.name}</p>
                    <p className="text-xs text-gray-500 truncate">{inq.subject}</p>
                  </div>
                  <Badge variant={inquiryStatusColor[inq.status] ?? "secondary"} className="text-xs shrink-0">
                    {inq.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}