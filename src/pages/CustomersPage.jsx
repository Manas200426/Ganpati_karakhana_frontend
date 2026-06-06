import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { Search } from "lucide-react";

import { getCustomers } from "../api/customerApi";

import CustomersTable from "../components/CustomersTable";

import AddCustomerModal from "../components/AddCustomerModal";

export default function CustomersPage() {
  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["customers"],

    queryFn: getCustomers,
  });

  const filteredCustomers = data.filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return <div>Loading customers...</div>;
  }

  if (error) {
    return <div>Failed to load customers</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">
            Customers
          </h1>

          <p className="text-[var(--color-muted)] mt-1">
            Manage customer details
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-[var(--color-primary)] text-white px-5 py-3 rounded-xl"
        >
          Add Customer
        </button>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4">
        <div className="flex items-center border border-[var(--color-border)] rounded-xl px-3">
          <Search size={18} className="text-gray-400" />

          <input
            type="text"
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 outline-none bg-transparent"
          />
        </div>
      </div>

      <CustomersTable customers={filteredCustomers} />

      <AddCustomerModal open={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
}
