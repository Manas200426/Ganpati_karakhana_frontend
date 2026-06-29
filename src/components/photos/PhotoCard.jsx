import { useState } from "react";
import { Star, Trash2, ZoomIn } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMurtiPhoto, setPrimaryPhoto } from "../../api/photoApi";
import { toast } from "sonner";
import DeletePhotoDialog from "./DeletePhotoDialog";

export default function PhotoCard({ photo, orderId, onPreview }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteMurtiPhoto(photo.id),
    onSuccess: () => {
      toast.success("Photo deleted.");
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete photo.");
    },
  });

  const primaryMutation = useMutation({
    mutationFn: () => setPrimaryPhoto(photo.id),
    onSuccess: () => {
      toast.success("Primary photo updated.");
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to set primary photo.");
    },
  });

  return (
    <>
      <div
        className={`relative group rounded-xl overflow-hidden border shadow-sm transition-all ${
          photo.isPrimary
            ? "border-yellow-400 ring-2 ring-yellow-300"
            : "border-(--color-border)"
        }`}
      >
        {photo.isPrimary && (
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-0.5 rounded-full">
            <Star size={10} fill="currentColor" />
            Primary
          </div>
        )}

        {/* Image + zoom overlay */}
        <div className="relative overflow-hidden">
          <img
            src={photo.imageUrl}
            alt="Murti photo"
            className="w-full h-36 object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              onClick={() => onPreview(photo)}
              className="bg-white/90 rounded-lg p-1.5 hover:bg-white transition-colors"
              aria-label="Preview photo"
            >
              <ZoomIn size={14} className="text-(--color-text)" />
            </button>
          </div>
        </div>

        {/* Action bar */}
        <div className="p-2 flex items-center gap-1.5 bg-(--color-surface)">
          {!photo.isPrimary && (
            <button
              onClick={() => primaryMutation.mutate()}
              disabled={primaryMutation.isPending || deleteMutation.isPending}
              className="flex-1 text-xs px-2 py-1.5 rounded-lg bg-purple-50 text-(--color-primary) hover:bg-purple-100 font-medium transition-colors disabled:opacity-50 truncate"
            >
              {primaryMutation.isPending ? "Saving…" : "Set as Primary"}
            </button>
          )}
          {photo.isPrimary && (
            <div className="flex-1" />
          )}
          <button
            onClick={() => setShowDeleteDialog(true)}
            disabled={deleteMutation.isPending || primaryMutation.isPending}
            className="p-1.5 rounded-lg text-(--color-danger) hover:bg-red-50 transition-colors disabled:opacity-50 shrink-0"
            aria-label="Delete photo"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <DeletePhotoDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={() => {
          setShowDeleteDialog(false);
          deleteMutation.mutate();
        }}
        isDeleting={deleteMutation.isPending}
      />
    </>
  );
}
