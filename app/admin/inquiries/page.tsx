import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const statusColor: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  new: "secondary",
  read: "outline",
  replied: "default",
  closed: "destructive",
};

const typeLabel: Record<string, string> = {
  general: "Contact",
  sell_car: "Sell Car",
  buy_car: "Buy Car",
  loan: "Loan",
  hire: "Hire",
};

export default async function InquiriesPage() {
  const supabase = await createClient();
  const { data: inquiries } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Inquiries</h1>
        <p className="text-gray-600 mt-1">{inquiries?.length ?? 0} total inquiries</p>
      </div>

      {!inquiries || inquiries.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-gray-500">
            No inquiries yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <Card key={inq.id}>
              <CardContent className="p-6">
                <div className="flex flex-wrap justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{inq.name}</h3>
                      <Badge variant="outline">{typeLabel[inq.type] ?? inq.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {inq.email} {inq.phone && `· ${inq.phone}`}
                    </p>
                  </div>
                  <Badge variant={statusColor[inq.status] ?? "secondary"}>
                    {inq.status}
                  </Badge>
                </div>

                <div className="mb-3">
                  <p className="text-sm font-medium">{inq.subject}</p>
                  <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">
                    {inq.message}
                  </p>
                </div>

                <div className="pt-4 border-t flex items-center gap-3">
                  <span className="text-xs text-gray-500">Update status:</span>
                  <div className="flex flex-wrap gap-2">
                    {["new", "read", "replied", "closed"].map((s) => (
                      <form key={s} action={async () => {
                        "use server";
                        const { updateInquiryStatusAction } = await import("@/modules/inquiries/actions/update-inquiry-status.action");
                        await updateInquiryStatusAction(inq.id, s);
                      }}>
                        <button
                          type="submit"
                          disabled={inq.status === s}
                          className={`text-xs px-3 py-1 rounded-full border transition ${
                            inq.status === s
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