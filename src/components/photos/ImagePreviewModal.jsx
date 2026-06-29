import { useEffect } from "react";
import { X } from "lucide-react";

export default function ImagePreviewModal({ photo, onClose }) {
  useEffect(() => {
    if (!photo) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [photo, onClose]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/40 rounded-full p-2 transition-colors"
        aria-label="Close preview"
      >
        <X size={20} />
      </button>
      <img
        src={photo.imageUrl}
        alt="Murti preview"
        className="max-w-[90vw] max-h-[90vh] rounded-xl object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
