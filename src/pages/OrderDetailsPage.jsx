import { useParams, useNavigate } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import {
  User,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Hash,
  Clock,
  Ruler,
  Layers,
  ArrowLeft,
} from "lucide-react";

import { getOrderById } from "../api/orderApi";

import StatusBadge from "../components/StatusBadge";

import UpdateStatusSelect from "../components/UpdateStatusSelect";

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={15} className="text-[var(--color-primary)]" />
      </div>
      <div>
        <p className="text-xs text-[var(--color-muted)] font-medium uppercase tracking-wide">
          {label}
        </p>
        <p className="font-medium text-[var(--color-text)] mt-0.5">
          {value || <span className="text-[var(--color-muted)] font-normal">—</span>}
        </p>
      </div>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm overflow-hidden">
      {title && (
        <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center gap-2">
          <div className="w-1 h-4 bg-[var(--color-primary)] rounded-full" />
          <h2 className="font-semibold text-[var(--color-text)]">{title}</h2>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[var(--color-muted)] text-sm">Loading order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-2">
          <p className="text-[var(--color-danger)] font-semibold">Failed to load order</p>
          <p className="text-[var(--color-muted)] text-sm">Please try again later.</p>
        </div>
      </div>
    );
  }

  const murti = order.murtiItems?.[0];
  const totalPrice = Number(order.totalPrice);
  const advancePaid = Number(order.advancePaid);
  const remainingAmount = totalPrice - advancePaid;
  const advancePercent = totalPrice > 0 ? Math.round((advancePaid / totalPrice) * 100) : 0;

  return (
    <div className="space-y-5 max-w-5xl mx-auto">

      {/* ── BACK BUTTON ── */}
      <button
        onClick={() => navigate("/orders")}
        className="flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Orders
      </button>

      {/* ── HERO HEADER ── */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)]" />
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={order.status} />
                <span className="text-xs text-[var(--color-muted)] bg-gray-100 px-2 py-0.5 rounded-full font-mono">
                  #{order.billNo}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)] leading-tight">
                {murti?.murtiName || "Unnamed Murti"}
              </h1>
              <p className="text-[var(--color-muted)] text-sm">
                {murti?.murtiType} &nbsp;·&nbsp; Ordered on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="shrink-0">
              <p className="text-xs text-[var(--color-muted)] font-medium uppercase tracking-wide mb-1.5">
                Update Status
              </p>
              <UpdateStatusSelect orderId={order.id} currentStatus={order.status} />
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* LEFT — spans 2 cols on large */}
        <div className="lg:col-span-2 space-y-5">

          {/* Murti Details */}
          <SectionCard title="Murti Details">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="col-span-2 sm:col-span-2">
                <InfoRow icon={Layers} label="Type" value={murti?.murtiType} />
              </div>
              <div className="col-span-2 sm:col-span-2">
                <InfoRow
                  icon={Ruler}
                  label="Height"
                  value={murti?.heightInches ? `${murti.heightInches} inches` : null}
                />
              </div>
              <div className="col-span-2 sm:col-span-2">
                <InfoRow icon={Layers} label="Clay Type" value={murti?.clayType} />
              </div>
              <div className="col-span-2 sm:col-span-2">
                <InfoRow
                  icon={Calendar}
                  label="Expected Delivery"
                  value={
                    order.expectedDelivery
                      ? new Date(order.expectedDelivery).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : null
                  }
                />
              </div>
            </div>

            {murti?.specialInstructions && (
              <div className="mt-5 bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-start gap-3">
                <FileText size={16} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[var(--color-primary)] mb-1">
                    Special Instructions
                  </p>
                  <p className="text-sm text-[var(--color-text)] leading-relaxed">
                    {murti.specialInstructions}
                  </p>
                </div>
              </div>
            )}
          </SectionCard>

          {/* Notes */}
          {order.notes && (
            <SectionCard title="Order Notes">
              <p className="text-sm text-[var(--color-text)] leading-relaxed">{order.notes}</p>
            </SectionCard>
          )}

          {/* Payment */}
          <SectionCard title="Payment Summary">
            <div className="space-y-4">
              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs text-[var(--color-muted)] mb-1.5">
                  <span>Advance paid ({advancePercent}%)</span>
                  <span>Remaining ({100 - advancePercent}%)</span>
                </div>
                <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] transition-all duration-500"
                    style={{ width: `${advancePercent}%` }}
                  />
                </div>
              </div>

              {/* Amounts */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-[var(--color-muted)] mb-1">Total</p>
                  <p className="text-lg font-bold text-[var(--color-text)]">₹{totalPrice.toLocaleString("en-IN")}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-[var(--color-muted)] mb-1">Paid</p>
                  <p className="text-lg font-bold text-[var(--color-success)]">₹{advancePaid.toLocaleString("en-IN")}</p>
                </div>
                <div className={`rounded-xl p-3 text-center ${remainingAmount > 0 ? "bg-red-50" : "bg-green-50"}`}>
                  <p className="text-xs text-[var(--color-muted)] mb-1">Remaining</p>
                  <p className={`text-lg font-bold ${remainingAmount > 0 ? "text-[var(--color-danger)]" : "text-[var(--color-success)]"}`}>
                    ₹{remainingAmount.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* RIGHT */}
        <div className="space-y-5">

          {/* Customer */}
          <SectionCard title="Customer">
            <div className="space-y-4">
              <InfoRow icon={User} label="Name" value={order.customer.name} />
              <InfoRow icon={Phone} label="Phone" value={order.customer.phone} />
              {order.customer.address && (
                <InfoRow icon={MapPin} label="Address" value={order.customer.address} />
              )}
              <InfoRow
                icon={Clock}
                label="Customer Since"
                value={new Date(order.customer.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              />
            </div>
          </SectionCard>

          {/* Order Meta */}
          <SectionCard title="Order Info">
            <div className="space-y-4">
              <InfoRow icon={Hash} label="Bill Number" value={order.billNo} />
              <InfoRow
                icon={Clock}
                label="Created At"
                value={new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              />
              <InfoRow
                icon={Calendar}
                label="Expected Delivery"
                value={
                  order.expectedDelivery
                    ? new Date(order.expectedDelivery).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : null
                }
              />
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
