import { useState } from "react";
import { ImageIcon } from "lucide-react";
import PhotoCard from "./PhotoCard";
import ImagePreviewModal from "./ImagePreviewModal";

export default function PhotoGallery({ photos, orderId }) {
  const [previewPhoto, setPreviewPhoto] = useState(null);

  if (!photos?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-2 text-(--color-muted)">
        <ImageIcon size={32} strokeWidth={1.5} />
        <p className="text-sm">No photos uploaded yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            orderId={orderId}
            onPreview={setPreviewPhoto}
          />
        ))}
      </div>
      <ImagePreviewModal photo={previewPhoto} onClose={() => setPreviewPhoto(null)} />
    </>
  );
}
