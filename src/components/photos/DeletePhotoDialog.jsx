import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";

export default function DeletePhotoDialog({ open, onClose, onConfirm, isDeleting }) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete Photo</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this photo? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm rounded-lg border border-(--color-border) text-(--color-text) hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm rounded-lg bg-(--color-danger) text-white hover:bg-red-700 transition-colors disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
