"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  approveSellRequest,
  rejectSellRequest,
} from "@/modules/inquiries/actions/review-sell-request.action";

export function ReviewActions({
  inquiryId,
  status,
}: {
  inquiryId: string;
  status: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");

  const isApproved = status === "replied";
  const isRejected = status === "closed";

  const handleApprove = () => {
    setStatusMsg(null);
    startTransition(async () => {
      const result = await approveSellRequest(inquiryId);
      setStatusMsg({
        type: result.success ? "success" : "error",
        message: result.message,
      });
      if (result.success) {
        setTimeout(() => {
          router.push("/admin/vehicles");
          router.refresh();
        }, 1500);
      }
    });
  };

  const handleReject = () => {
    setStatusMsg(null);
    startTransition(async () => {
      const result = await rejectSellRequest(inquiryId, reason);
      setStatusMsg({
        type: result.success ? "success" : "error",
        message: result.message,
      });
      if (result.success) {
        setRejectOpen(false);
        setReason("");
        router.refresh();
      }
    });
  };

  if (isApproved) {
    return (
      <div className="p-4 rounded-lg border bg-green-50 border-green-200 text-green-800 text-sm">
        ✅ This request has been approved. A draft vehicle was created — check the Vehicles section.
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="p-4 rounded-lg border bg-red-50 border-red-200 text-red-800 text-sm">
        ❌ This request has been rejected.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {statusMsg && (
        <div
          className={`flex items-start gap-3 p-4 rounded-lg border ${
            statusMsg.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {statusMsg.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          )}
          <p className="text-sm">{statusMsg.message}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button onClick={handleApprove} disabled={isPending} className="flex-1" size="lg">
          <ThumbsUp className="mr-2 h-5 w-5" />
          {isPending ? "Approving..." : "Approve & Create Draft Vehicle"}
        </Button>

        <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" size="lg" disabled={isPending}>
              <ThumbsDown className="mr-2 h-5 w-5" /> Reject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Request</DialogTitle>
              <DialogDescription>
                Let us know why this submission is being rejected (internal use only).
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Reason (optional)</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  placeholder="e.g., Photos unclear, price unrealistic, duplicate submission..."
                />
              </div>
              <Button onClick={handleReject} disabled={isPending} variant="destructive" className="w-full">
                {isPending ? "Rejecting..." : "Confirm Rejection"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}