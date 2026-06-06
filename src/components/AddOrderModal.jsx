import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createOrder } from "../api/orderApi";

import { getCustomers } from "../api/customerApi";

const MURTI_NAMES = [
  "Ubh Mandi Varadas",
  "Savkar",
  "Lamb Paay Savkar",
  "Small Lalbaug",
  "Medium Lalbaug",
  "Large Lalbaug",
  "Small Dagdusheth",
  "Large Dagdusheth",
  "German Couch",
  "Small Titwala",
  "Varadas",
  "Double Mandi Varadas",
  "M.K Varadas",
  "Baal Murti (Child Murti)",
  "Curved Couch",
  "Large Savkar",
  "Custom",
];

export default function AddOrderModal({ open, onClose }) {
  const queryClient = useQueryClient();

  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],

    queryFn: getCustomers,
  });

  const initialFormData = {
    customerId: "",

    billNo: "",

    totalPrice: "",

    advancePaid: "",

    notes: "",

    expectedDelivery: "",

    murtiName: "",

    murtiType: "",

    heightInches: "",

    clayType: "",

    specialInstructions: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [murtiDropdownOpen, setMurtiDropdownOpen] = useState(false);
  const murtiDropdownRef = useRef(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const customerDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        murtiDropdownRef.current &&
        !murtiDropdownRef.current.contains(e.target)
      ) {
        setMurtiDropdownOpen(false);
      }
      if (
        customerDropdownRef.current &&
        !customerDropdownRef.current.contains(e.target)
      ) {
        setCustomerDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCustomers = customerSearch
    ? customers.filter((c) =>
        c.name.toLowerCase().includes(customerSearch.toLowerCase())
      )
    : [];

  const filteredMurtiNames = formData.murtiName
    ? MURTI_NAMES.filter((n) =>
        n.toLowerCase().includes(formData.murtiName.toLowerCase()),
      )
    : MURTI_NAMES.slice(0, 2);

  const mutation = useMutation({
    mutationFn: createOrder,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard-stats"],
      });
      toast.success("Order created successfully");
      setFormData(initialFormData);
      setCustomerSearch("");
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
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.customerId) {
      toast.error("Please select a customer");
      return;
    }

    mutation.mutate({
      customerId: formData.customerId,

      billNo: formData.billNo,

      totalPrice: Number(formData.totalPrice),

      advancePaid: Number(formData.advancePaid),

      notes: formData.notes,

      expectedDelivery: formData.expectedDelivery
        ? new Date(formData.expectedDelivery).toISOString()
        : null,

      murtiItems: [
        {
          murtiName: formData.murtiName,

          murtiType: formData.murtiType,

          heightInches: Number(formData.heightInches),

          clayType: formData.clayType,

          specialInstructions: formData.specialInstructions,
        },
      ],
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] sticky top-0 bg-white rounded-t-2xl z-10">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-primary)]">
              Add New Order
            </h2>
            <p className="text-sm text-[var(--color-muted)] mt-0.5">
              Fill in the details to create a new order
            </p>
          </div>
          <button
            onClick={() => {
              setFormData(initialFormData);
              setCustomerSearch("");
              onClose();
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 text-xl transition-colors"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* ORDER INFO */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-5 bg-[var(--color-primary)] rounded-full" />
              <h3 className="text-base font-semibold text-[var(--color-primary)]">
                Order Information
              </h3>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="customerSearch"
                className="block text-sm font-medium text-[var(--color-text)]"
              >
                Customer <span className="text-[var(--color-danger)]">*</span>
              </label>
              <div className="relative" ref={customerDropdownRef}>
                <div className="relative">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none"
                  />
                  <input
                    id="customerSearch"
                    type="text"
                    value={customerSearch}
                    onChange={(e) => {
                      setCustomerSearch(e.target.value);
                      setFormData((prev) => ({ ...prev, customerId: "" }));
                      setCustomerDropdownOpen(true);
                    }}
                    onFocus={() => setCustomerDropdownOpen(true)}
                    autoComplete="off"
                    placeholder="Search customer..."
                    className="w-full border border-[var(--color-border)] rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-transparent transition"
                  />
                </div>
                {customerDropdownOpen && filteredCustomers.length > 0 && (
                  <ul className="absolute z-50 mt-1 w-full bg-white border border-[var(--color-border)] rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {filteredCustomers.map((customer) => (
                      <li
                        key={customer.id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setFormData((prev) => ({ ...prev, customerId: customer.id }));
                          setCustomerSearch(customer.name);
                          setCustomerDropdownOpen(false);
                        }}
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-purple-50 hover:text-[var(--color-primary)]"
                      >
                        {customer.name}
                      </li>
                    ))}
                  </ul>
                )}
                {customerDropdownOpen && customerSearch && filteredCustomers.length === 0 && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-[var(--color-border)] rounded-xl shadow-lg px-3 py-2.5 text-sm text-[var(--color-muted)]">
                    No customers found
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="billNo"
                  className="block text-sm font-medium text-[var(--color-text)]"
                >
                  Bill Number{" "}
                  <span className="text-[var(--color-danger)]">*</span>
                </label>
                <input
                  id="billNo"
                  type="text"
                  name="billNo"
                  value={formData.billNo}
                  onChange={handleChange}
                  required
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-transparent transition"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="expectedDelivery"
                  className="block text-sm font-medium text-[var(--color-text)]"
                >
                  Expected Delivery Date
                </label>
                <input
                  id="expectedDelivery"
                  type="date"
                  name="expectedDelivery"
                  value={formData.expectedDelivery}
                  onChange={handleChange}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-transparent transition"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="totalPrice"
                  className="block text-sm font-medium text-[var(--color-text)]"
                >
                  Total Price (₹){" "}
                  <span className="text-[var(--color-danger)]">*</span>
                </label>
                <input
                  id="totalPrice"
                  type="number"
                  name="totalPrice"
                  value={formData.totalPrice}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-transparent transition"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="advancePaid"
                  className="block text-sm font-medium text-[var(--color-text)]"
                >
                  Advance Paid (₹){" "}
                  <span className="text-[var(--color-danger)]">*</span>
                </label>
                <input
                  id="advancePaid"
                  type="number"
                  name="advancePaid"
                  value={formData.advancePaid}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-transparent transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-[var(--color-text)]"
              >
                Order Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Any additional notes for this order..."
                className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-transparent transition resize-none"
              />
            </div>
          </div>

          {/* MURTI DETAILS */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-5 bg-[var(--color-primary)] rounded-full" />
              <h3 className="text-base font-semibold text-[var(--color-primary)]">
                Murti Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="murtiName"
                  className="block text-sm font-medium text-[var(--color-text)]"
                >
                  Murti Name{" "}
                  <span className="text-[var(--color-danger)]">*</span>
                </label>
                <div className="relative" ref={murtiDropdownRef}>
                  <input
                    id="murtiName"
                    type="text"
                    name="murtiName"
                    value={formData.murtiName}
                    onChange={(e) => {
                      handleChange(e);
                      setMurtiDropdownOpen(true);
                    }}
                    onFocus={() => setMurtiDropdownOpen(true)}
                    required
                    autoComplete="off"
                    placeholder="Search murti name..."
                    className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-transparent transition"
                  />
                  {murtiDropdownOpen && filteredMurtiNames.length > 0 && (
                    <ul className="absolute z-50 mt-1 w-full bg-white border border-[var(--color-border)] rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {filteredMurtiNames.map((name) => (
                        <li
                          key={name}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setFormData((prev) => ({
                              ...prev,
                              murtiName: name,
                            }));
                            setMurtiDropdownOpen(false);
                          }}
                          className="px-3 py-2 text-sm cursor-pointer hover:bg-purple-50 hover:text-[var(--color-primary)]"
                        >
                          {name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="murtiType"
                  className="block text-sm font-medium text-[var(--color-text)]"
                >
                  Murti Type{" "}
                  <span className="text-[var(--color-danger)]">*</span>
                </label>
                <input
                  id="murtiType"
                  type="text"
                  name="murtiType"
                  value={formData.murtiType}
                  onChange={handleChange}
                  required
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-transparent transition"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="heightInches"
                  className="block text-sm font-medium text-[var(--color-text)]"
                >
                  Height (inches){" "}
                  <span className="text-[var(--color-danger)]">*</span>
                </label>
                <input
                  id="heightInches"
                  type="number"
                  name="heightInches"
                  value={formData.heightInches}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-transparent transition"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="clayType"
                  className="block text-sm font-medium text-[var(--color-text)]"
                >
                  Clay Type
                </label>
                <input
                  id="clayType"
                  type="text"
                  name="clayType"
                  value={formData.clayType}
                  onChange={handleChange}
                  className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-transparent transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="specialInstructions"
                className="block text-sm font-medium text-[var(--color-text)]"
              >
                Special Instructions
              </label>
              <textarea
                id="specialInstructions"
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleChange}
                rows={3}
                placeholder="Any special instructions for crafting this murti..."
                className="w-full border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-transparent transition resize-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setFormData(initialFormData);
                setCustomerSearch("");
                onClose();
              }}
              className="flex-1 border border-[var(--color-border)] text-[var(--color-muted)] rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white rounded-xl py-2.5 text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? "Creating..." : "Create Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
