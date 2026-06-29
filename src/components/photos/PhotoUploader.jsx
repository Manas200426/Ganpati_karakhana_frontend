import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadMurtiPhoto } from "../../api/photoApi";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

const MAX_SIZE = 5 * 1024 * 1024;

export default function PhotoUploader({ murtiItemId, orderId }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: (file) => uploadMurtiPhoto(murtiItemId, file),
    onSuccess: () => {
      toast.success("Photo uploaded successfully.");
      setSelectedFile(null);
      if (inputRef.current) inputRef.current.value = "";
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to upload photo.");
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_SIZE) {
      toast.error("File too large. Maximum size is 5 MB.");
      e.target.value = "";
      return;
    }
    setSelectedFile(file);
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const isPending = uploadMutation.isPending;

  return (
    <div className="flex items-center gap-2 flex-wrap pt-1">
      <label
        className={`cursor-pointer flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-(--color-border) transition-colors ${
          isPending
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-50 text-(--color-muted)"
        }`}
      >
        <Upload size={14} />
        <span className="max-w-[140px] truncate">
          {selectedFile ? selectedFile.name : "Choose image"}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isPending}
        />
      </label>

      {selectedFile && (
        <>
          <button
            onClick={() => uploadMutation.mutate(selectedFile)}
            disabled={isPending}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-(--color-primary) text-white hover:bg-(--color-primary-light) transition-colors disabled:opacity-60"
          >
            {isPending ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading…
              </>
            ) : (
              "Upload"
            )}
          </button>
          {!isPending && (
            <button
              onClick={handleClear}
              className="p-1.5 rounded-lg text-(--color-muted) hover:bg-gray-100 transition-colors"
              aria-label="Clear selection"
            >
              <X size={14} />
            </button>
          )}
        </>
      )}
    </div>
  );
}
