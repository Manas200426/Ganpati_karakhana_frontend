import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCustomer } from "../api/customerApi";

export default function AddCustomerModal({ open, onClose }) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",

    phone: "",

    address: "",
  });

  const mutation = useMutation({
    mutationFn: createCustomer,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });

      toast.success("Customer created successfully");

      setFormData({
        name: "",
        phone: "",
        address: "",
      });

      onClose();
    },

    onError: (error) => {
      const res = error?.response?.data;

      const firstError = res?.errors?.[0];

      if (firstError?.message) {
        toast.error(firstError.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    mutation.mutate(formData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-primary)]">
            Add Customer
          </h2>

          <button onClick={onClose} className="text-2xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Customer Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-[var(--color-border)] rounded-xl p-3"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full border border-[var(--color-border)] rounded-xl p-3"
          />

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            rows={4}
            className="w-full border border-[var(--color-border)] rounded-xl p-3"
          />

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-[var(--color-primary)] text-white rounded-xl p-3"
          >
            {mutation.isPending ? "Creating..." : "Create Customer"}
          </button>
        </form>
      </div>
    </div>
  );
}
