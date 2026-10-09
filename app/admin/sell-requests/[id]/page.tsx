import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Calendar, Gauge } from "lucide-react";
import { getInquiryWithPhotos } from "@/modules/inquiries/services/inquiry.service";
import { getSignedPhotoUrls } from "@/modules/media/services/sell-request-storage.service";
import { ReviewActions } from "@/components/sell-requests/review-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function SellRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inquiry = await getInquiryWithPhotos(id);

  if (!inquiry) notFound();

  const photoPaths = (inquiry.inquiry_photos ?? []).map((p) => p.path);
  const signedUrls = photoPaths.length > 0 ? await getSignedPhotoUrls(photoPaths, 3600) : {};

  return (
    <div className="p-8">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/admin/sell-requests">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to sell requests
          </Link>
        </Button>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl font-bold">{inquiry.name}</h1>
          <Badge
            variant={
              inquiry.status === "replied"
                ? "default"
                : inquiry.status === "closed"
                ? "destructive"
                : "secondary"
            }
          >
            {inquiry.status === "replied"
              ? "Approved"
              : inquiry.status === "closed"
              ? "Rejected"
              : "Pending Review"}
          </Badge>
        </div>
        <p className="text-gray-600 mt-1">
          Submitted {new Date(inquiry.created_at).toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact */}
          <Card>
            <CardContent className="p-6 space-y-3">
              <h2 className="font-bold mb-2">Contact Information</h2>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-500" />
                <a href={`mailto:${inquiry.email}`} className="text-primary hover:underline">
                  {inquiry.email}
                </a>
              </div>
              {inquiry.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <a href={`tel:${inquiry.phone}`} className="text-primary hover:underline">
                    {inquiry.phone}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vehicle details */}
          <Card>
            <CardContent className="p-6">
              <h2 className="font-bold mb-4">Vehicle Details</h2>
              <pre className="text-sm whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                {inquiry.message}
              </pre>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card>
            <CardContent className="p-6">
              <h2 className="font-bold mb-4">
                Photos ({photoPaths.length})
              </h2>
              {photoPaths.length === 0 ? (
                <p className="text-sm text-gray-500">No photos uploaded.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(inquiry.inquiry_photos ?? []).map((photo) => {
                    const url = signedUrls[photo.path];
                    return (
                      <div
                        key={photo.id}
                        className="aspect-square rounded-lg overflow-hidden border bg-gray-100"
                      >
                        {url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={url}
                            alt={photo.filename}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No preview
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: actions */}
        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h2 className="font-bold mb-4">Review Decision</h2>
              <ReviewActions inquiryId={inquiry.id} status={inquiry.status} />

              {inquiry.rejection_reason && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
                  <p className="font-medium text-red-800 mb-1">Rejection reason:</p>
                  <p className="text-red-700">{inquiry.rejection_reason}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}