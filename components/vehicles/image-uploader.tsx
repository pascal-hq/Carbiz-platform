"use client";

import { useState, useTransition, useRef } from "react";
import { Upload, Trash2, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  uploadImageAction,
  deleteImageAction,
  setPrimaryImageAction,
} from "@/modules/media/actions/image.action";

interface ImageItem {
  id: string;
  url: string;
  is_primary: boolean;
  display_order: number;
}

export function ImageUploader({
  vehicleId,
  initialImages,
}: {
  vehicleId: string;
  initialImages: ImageItem[];
}) {
  const [images, setImages] = useState<ImageItem[]>(initialImages);
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refresh = async () => {
    // Trigger a server refresh by re-fetching in the parent.
    // For now, we update local state optimistically.
    window.location.reload();
  };

  const handleFiles = async (files: FileList) => {
    setMessage(null);
    setUploading(true);

    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const result = await uploadImageAction(vehicleId, fd);
      if (!result.success) {
        setMessage({ type: "error", text: result.message });
      }
    }

    setUploading(false);
    refresh();
  };

  const handleDelete = (imageId: string) => {
    if (!confirm("Delete this image?")) return;
    startTransition(async () => {
      const result = await deleteImageAction(vehicleId, imageId);
      if (result.success) {
        setImages((prev) => prev.filter((i) => i.id !== imageId));
        setMessage({ type: "success", text: result.message });
      } else {
        setMessage({ type: "error", text: result.message });
      }
    });
  };

  const handleSetPrimary = (imageId: string) => {
    startTransition(async () => {
      const result = await setPrimaryImageAction(vehicleId, imageId);
      if (result.success) {
        setImages((prev) =>
          prev.map((i) => ({ ...i, is_primary: i.id === imageId }))
        );
        setMessage({ type: "success", text: result.message });
      } else {
        setMessage({ type: "error", text: result.message });
      }
    });
  };

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-lg border ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        {uploading ? (
          <>
            <Loader2 className="h-10 w-10 mx-auto text-primary animate-spin mb-3" />
            <p className="text-gray-600">Uploading...</p>
          </>
        ) : (
          <>
            <Upload className="h-10 w-10 mx-auto text-gray-400 mb-3" />
            <p className="font-medium">Click or drag images here to upload</p>
            <p className="text-sm text-gray-500 mt-1">Max 5MB per image. JPG, PNG, WebP.</p>
          </>
        )}
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">
            Uploaded Images ({images.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="relative group border rounded-lg overflow-hidden bg-gray-100 aspect-square"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-cover"
                />

                {img.is_primary && (
                  <Badge className="absolute top-2 left-2 bg-primary">
                    <Star className="h-3 w-3 mr-1" /> Primary
                  </Badge>
                )}

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  {!img.is_primary && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleSetPrimary(img.id)}
                      disabled={isPending}
                    >
                      <Star className="h-3 w-3 mr-1" /> Set Primary
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(img.id)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}