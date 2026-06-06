import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import AddOrderModal from "../components/AddOrderModal";
import { Search } from "lucide-react";

import { getOrders } from "../api/orderApi";

import OrderCardList from "../components/OrderCardList";

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],

    queryFn: getOrders,
  });

  const filteredOrders = data.filter((order) => {
    const matchesSearch =
      order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      order.billNo.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = !statusFilter || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>Failed to load orders</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">
            Orders
          </h1>

          <p className="text-[var(--color-muted)] mt-1">
            Manage all murti orders
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-[var(--color-primary)] text-white px-5 py-3 rounded-xl"
        >
          Add Order
        </button>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 flex flex-col md:flex-row gap-4">
        <div className="flex items-center border border-[var(--color-border)] rounded-xl px-3 flex-1">
          <Search size={18} className="text-gray-400" />

          <input
            type="text"
            placeholder="Search customer or bill no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 outline-none bg-transparent"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-[var(--color-border)] rounded-xl p-3"
        >
          <option value="">All Status</option>

          <option value="PENDING">Pending</option>

          <option value="IN_PROGRESS">In Progress</option>

          <option value="PAINTING">Painting</option>

          <option value="READY">Ready</option>

          <option value="DELIVERED">Delivered</option>
        </select>
      </div>

      <OrderCardList orders={filteredOrders} />
      <AddOrderModal open={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
}
