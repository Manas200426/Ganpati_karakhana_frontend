import { useQuery } from "@tanstack/react-query";

import { Package, Clock, CheckCircle, IndianRupee, Users } from "lucide-react";

import { getDashboardStats } from "../api/dashboardApi";

import StatCard from "../components/StatCard";

import RecentOrdersTable from "../components/RecentOrdersTable";

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats"],

    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return <div className="text-lg">Loading dashboard...</div>;
  }

  if (error) {
    return <div>Failed to load dashboard</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-primary)]">
          Dashboard
        </h1>

        <p className="text-[var(--color-muted)] mt-1">
          Overview of your karkhana
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <StatCard
          title="Total Orders"
          value={data.totalOrders}
          icon={<Package className="text-[var(--color-primary)]" />}
        />

        <StatCard
          title="Pending Orders"
          value={data.pendingOrders}
          icon={<Clock className="text-yellow-600" />}
        />

        <StatCard
          title="Ready Orders"
          value={data.readyOrders}
          icon={<CheckCircle className="text-green-600" />}
        />

        <StatCard
          title="Customers"
          value={data.totalCustomers}
          icon={<Users className="text-blue-600" />}
        />

        <StatCard
          title="Revenue"
          value={`₹${data.totalRevenue}`}
          icon={<IndianRupee className="text-[var(--color-primary)]" />}
        />

        <StatCard
          title="Advance Received"
          value={`₹${data.advanceReceived}`}
          icon={<IndianRupee className="text-green-600" />}
        />
      </div>

      <RecentOrdersTable orders={data.recentOrders} />
    </div>
  );
}
