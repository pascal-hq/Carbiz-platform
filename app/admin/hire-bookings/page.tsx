import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const statusColor: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  confirmed: "default",
  ongoing: "outline",
  completed: "default",
  cancelled: "destructive",
};

export default async function HireBookingsPage() {
  const supabase = await createClient();
  const { data: bookings } = await supabase
    .from("hire_bookings")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Hire Bookings</h1>
        <p className="text-gray-600 mt-1">{bookings?.length ?? 0} bookings</p>
      </div>

      {!bookings || bookings.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-gray-500">
            No hire bookings yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <Card key={b.id}>
              <CardContent className="p-6">
                <div className="flex flex-wrap justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{b.full_name}</h3>
                    <p className="text-sm text-gray-500">{b.email} · {b.phone}</p>
                  </div>
                  <Badge variant={statusColor[b.status] ?? "secondary"}>{b.status}</Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Car Type</p>
                    <p className="font-medium">{b.car_type}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Pickup</p>
                    <p className="font-medium">
                      {new Date(b.pickup_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Return</p>
                    <p className="font-medium">
                      {new Date(b.return_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p className="font-medium">{b.pickup_location}</p>
                  </div>
                </div>

                {b.additional_info && (
                  <p className="text-sm text-gray-600 mt-4 pt-4 border-t">
                    {b.additional_info}
                  </p>
                )}

                <div className="mt-4 pt-4 border-t flex items-center gap-3">
                  <span className="text-xs text-gray-500">Update status:</span>
                  <div className="flex flex-wrap gap-2">
                    {["pending", "confirmed", "ongoing", "completed", "cancelled"].map((s) => (
                      <form key={s} action={async () => {
                        "use server";
                        const { updateBookingStatusAction } = await import("@/modules/bookings/actions/update-booking-status.action");
                        await updateBookingStatusAction(b.id, s);
                      }}>
                        <button
                          type="submit"
                          disabled={b.status === s}
                          className={`text-xs px-3 py-1 rounded-full border transition ${
                            b.status === s
                              ? "bg-primary text-white border-primary cursor-default"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          {s}
                        </button>
                      </form>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}