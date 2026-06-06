import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateOrderStatus } from "../api/orderApi";

export default function UpdateStatusSelect({ orderId, currentStatus }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateOrderStatus,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard-stats"],
      });
      toast.success("Status updated");
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  const handleChange = (e) => {
    mutation.mutate({
      orderId,

      status: e.target.value,
    });
  };

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={mutation.isPending}
      className="border border-[var(--color-border)] rounded-lg px-3 py-2 bg-white"
    >
      <option value="PENDING">Pending</option>

      <option value="IN_PROGRESS">In Progress</option>

      <option value="PAINTING">Painting</option>

      <option value="READY">Ready</option>

      <option value="DELIVERED">Delivered</option>
    </select>
  );
}
