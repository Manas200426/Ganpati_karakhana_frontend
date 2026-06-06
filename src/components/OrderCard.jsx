import StatusBadge from "./StatusBadge";
import { useNavigate } from "react-router-dom";
import UpdateStatusSelect from "./UpdateStatusSelect";
import { User, Ruler, Calendar, FileText, AlertCircle } from "lucide-react";

export default function OrderCard({ order }) {
  const navigate = useNavigate();
  const murti = order.murtiItems?.[0];

  const isOverdue =
    order.expectedDelivery &&
    new Date(order.expectedDelivery) < new Date() &&
    order.status !== "DELIVERED";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/orders/${order.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") navigate(`/orders/${order.id}`);
      }}
      className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm cursor-pointer hover:shadow-md hover:border-purple-200 transition-all duration-200 overflow-hidden group"
    >
      {/* Top accent */}
      <div className="h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)]" />

      <div className="p-5 space-y-3.5">
        {/* Header: murti name + status */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-[var(--color-primary)] truncate group-hover:text-[var(--color-primary-light)] transition-colors">
              {murti?.murtiName || "—"}
            </h2>
            <div className="flex items-center gap-1.5 mt-1 text-sm text-[var(--color-muted)]">
              <User size={12} />
              <span className="truncate">{order.customer.name}</span>
              <span className="text-[var(--color-border)]">·</span>
              <span className="font-mono text-xs">{order.billNo}</span>
            </div>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Key specs */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-gray-50 rounded-xl px-3 py-2">
            <p className="text-xs text-[var(--color-muted)] mb-0.5">Type</p>
            <p className="font-semibold text-[var(--color-text)] truncate">
              {murti?.murtiType || "—"}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl px-3 py-2">
            <p className="text-xs text-[var(--color-muted)] mb-0.5">Height</p>
            <p className="font-semibold text-[var(--color-text)]">
              {murti?.heightInches ? `${murti.heightInches} inch` : "—"}
            </p>
          </div>
          {murti?.clayType && (
            <div className="bg-gray-50 rounded-xl px-3 py-2">
              <p className="text-xs text-[var(--color-muted)] mb-0.5">Clay</p>
              <p className="font-semibold text-[var(--color-text)] truncate">
                {murti.clayType}
              </p>
            </div>
          )}
          <div className={`rounded-xl px-3 py-2 ${isOverdue ? "bg-red-50" : "bg-gray-50"}`}>
            <p className="text-xs text-[var(--color-muted)] mb-0.5">Delivery</p>
            <p className={`font-semibold flex items-center gap-1 ${isOverdue ? "text-[var(--color-danger)]" : "text-[var(--color-text)]"}`}>
              {isOverdue && <AlertCircle size={12} />}
              {order.expectedDelivery
                ? new Date(order.expectedDelivery).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })
                : "—"}
            </p>
          </div>
        </div>

        {/* Special instructions */}
        {murti?.specialInstructions && (
          <div className="bg-purple-50 border border-purple-100 rounded-xl px-3 py-2.5 flex items-start gap-2">
            <FileText size={13} className="text-[var(--color-primary)] mt-0.5 shrink-0" />
            <p className="text-xs text-[var(--color-text)] leading-relaxed line-clamp-2">
              {murti.specialInstructions}
            </p>
          </div>
        )}

        {/* Notes */}
        {order.notes && (
          <p className="text-xs text-[var(--color-muted)] italic line-clamp-1">
            "{order.notes}"
          </p>
        )}

        {/* Status updater */}
        <div
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <UpdateStatusSelect orderId={order.id} currentStatus={order.status} />
        </div>
      </div>
    </div>
  );
}
