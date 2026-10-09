import Link from "next/link";
import { getSellCarRequests } from "@/modules/inquiries/services/inquiry.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon, ArrowRight } from "lucide-react";

const statusColor: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  new: "secondary",
  read: "outline",
  replied: "default",
  closed: "destructive",
};

export default async function SellRequestsPage() {
  const requests = await getSellCarRequests();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Sell Car Requests</h1>
        <p className="text-gray-600 mt-1">
          {requests.length} submission{requests.length === 1 ? "" : "s"} from sellers
        </p>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-gray-500">
            No sell car requests yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const photoCount = req.inquiry_photos?.length ?? 0;
            const isApproved = req.status === "replied";
            const isRejected = req.status === "closed";

            return (
              <Link key={req.id} href={`/admin/sell-requests/${req.id}`}>
                <Card className="hover:shadow-md transition cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex flex-wrap justify-between gap-4 items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{req.name}</h3>
                          <Badge variant={statusColor[req.status] ?? "secondary"}>
                            {isApproved ? "Approved" : isRejected ? "Rejected" : "Pending"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{req.email} · {req.phone}</p>
                        <p className="text-sm text-gray-700 mt-2">{req.subject}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <ImageIcon className="h-3 w-3" />
                            {photoCount} photo{photoCount === 1 ? "" : "s"}
                          </span>
                          <span>Submitted {new Date(req.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 mt-1 shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}