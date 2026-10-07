import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

const statusColor: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  under_review: "outline",
  approved: "default",
  rejected: "destructive",
  disbursed: "default",
};

export default async function LoanApplicationsPage() {
  const supabase = await createClient();
  const { data: loans } = await supabase
    .from("logbook_loans")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Loan Applications</h1>
        <p className="text-gray-600 mt-1">{loans?.length ?? 0} applications</p>
      </div>

      {!loans || loans.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-gray-500">
            No loan applications yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => (
            <Card key={loan.id}>
              <CardContent className="p-6">
                <div className="flex flex-wrap justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{loan.full_name}</h3>
                    <p className="text-sm text-gray-500">
                      {loan.email} · {loan.phone}
                    </p>
                  </div>
                  <Badge variant={statusColor[loan.status] ?? "secondary"}>
                    {loan.status.replace("_", " ")}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Vehicle</p>
                    <p className="font-medium">
                      {loan.vehicle_make} {loan.vehicle_model} ({loan.vehicle_year})
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Estimated Value</p>
                    <p className="font-medium">{formatPrice(Number(loan.estimated_value))}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Requested</p>
                    <p className="font-medium">{formatPrice(Number(loan.requested_amount))}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Submitted</p>
                    <p className="font-medium">
                      {new Date(loan.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {loan.additional_info && (
                  <p className="text-sm text-gray-600 mt-4 pt-4 border-t">
                    {loan.additional_info}
                  </p>
                )}

                <div className="mt-4 pt-4 border-t flex items-center gap-3">
                  <span className="text-xs text-gray-500">Update status:</span>
                  <div className="flex flex-wrap gap-2">
                    {["pending", "under_review", "approved", "rejected", "disbursed"].map((s) => (
                      <form key={s} action={async (fd: FormData) => {
                        "use server";
                        const { updateLoanStatusAction } = await import("@/modules/loans/actions/update-loan-status.action");
                        await updateLoanStatusAction(loan.id, s);
                      }}>
                        <button
                          type="submit"
                          disabled={loan.status === s}
                          className={`text-xs px-3 py-1 rounded-full border transition ${
                            loan.status === s
                              ? "bg-primary text-white border-primary cursor-default"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          {s.replace("_", " ")}
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