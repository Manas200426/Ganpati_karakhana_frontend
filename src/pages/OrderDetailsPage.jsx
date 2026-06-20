import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";

import { getOrderById } from "../api/orderApi";
import api from "../api/axios";
import StatusBadge from "../components/StatusBadge";
import UpdateStatusSelect from "../components/UpdateStatusSelect";

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 text-sm text-(--color-muted)">
      <Icon size={18} className="text-(--color-primary)" />
      <div>
        <p className="text-xs uppercase tracking-[0.22em]">{label}</p>
        <p className="font-medium text-(--color-text)">{value || "—"}</p>
      </div>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <section className="bg-(--color-surface) border border-(--color-border) rounded-3xl p-6 space-y-4">
      {title && (
        <h2 className="text-sm font-semibold text-(--color-primary)">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [whatsappLoading, setWhatsappLoading] = useState(false);

  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id),
    enabled: Boolean(id),
  });

  const handleSendWhatsApp = async () => {
    if (!order) return;

    try {
      setWhatsappLoading(true);
      const response = await api.get(`/orders/${id}/whatsapp-message`);
      const { customerPhone, message } = response.data.data;
      const whatsappUrl = `https://wa.me/${customerPhone}?text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, "_blank");
      toast.success("Opening WhatsApp…");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Unable to generate WhatsApp message";
      toast.error(errorMessage);
    } finally {
      setWhatsappLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-sm text-(--color-muted)">Loading order…</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-(--color-surface) border border-(--color-border) rounded-3xl p-8">
          <h1 className="text-xl font-semibold">Failed to load order</h1>
          <p className="mt-2 text-sm text-(--color-muted)">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const murti = order.murtiItems?.[0];
  const totalPrice = Number(order.totalPrice || 0);
  const advancePaid = Number(order.advancePaid || 0);
  const remainingAmount = totalPrice - advancePaid;
  const advancePercent =
    totalPrice > 0 ? Math.round((advancePaid / totalPrice) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <button
        onClick={() => navigate("/orders")}
        className="inline-flex items-center gap-2 text-sm text-(--color-muted) hover:text-(--color-primary) transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Orders
      </button>

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <div className="space-y-6">
          <div className="bg-(--color-surface) border border-(--color-border) rounded-3xl p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-(--color-muted)">
                  <span>Order</span>
                  <span className="font-mono">#{order.billNo}</span>
                </div>
                <h1 className="mt-3 text-3xl font-bold text-(--color-primary)">
                  {murti?.murtiName || "Unnamed Murti"}
                </h1>
                <p className="mt-2 text-sm text-(--color-muted)">
                  {murti?.murtiType || "—"} · Ordered on{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <StatusBadge status={order.status} />
                <UpdateStatusSelect
                  orderId={order.id}
                  currentStatus={order.status}
                />
              </div>
            </div>
          </div>

          <SectionCard title="Murti details">
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow
                icon={Ruler}
                label="Height"
                value={murti?.heightInches ? `${murti.heightInches} inch` : "—"}
              />
              <InfoRow
                icon={Layers}
                label="Clay type"
                value={murti?.clayType}
              />
              <InfoRow
                icon={Calendar}
                label="Expected delivery"
                value={
                  order.expectedDelivery
                    ? new Date(order.expectedDelivery).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                        },
                      )
                    : "—"
                }
              />
              <InfoRow
                icon={FileText}
                label="Special instructions"
                value={murti?.specialInstructions}
              />
            </div>
          </SectionCard>

          <SectionCard title="Order notes">
            <p className="text-sm text-(--color-muted)">
              {order.notes || "No notes available."}
            </p>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Customer">
            <div className="space-y-4">
              <InfoRow icon={User} label="Name" value={order.customer?.name} />
              <InfoRow
                icon={Phone}
                label="Phone"
                value={order.customer?.phone}
              />
              <InfoRow
                icon={MapPin}
                label="Address"
                value={order.customer?.address}
              />
              <InfoRow
                icon={Calendar}
                label="Order date"
                value={new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              />
            </div>
          </SectionCard>

          <SectionCard title="Payment">
            <div className="grid gap-4">
              <InfoRow
                icon={Hash}
                label="Total price"
                value={`₹${totalPrice}`}
              />
              <InfoRow
                icon={Clock}
                label="Advance paid"
                value={`₹${advancePaid}`}
              />
              <InfoRow
                icon={FileText}
                label="Remaining"
                value={`₹${remainingAmount}`}
              />
              <div className="rounded-3xl bg-(--color-surface) border border-(--color-border) p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-(--color-muted)">
                  Advance paid
                </p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-(--color-border)">
                  <div
                    className="h-full rounded-full bg-(--color-primary)"
                    style={{ width: `${advancePercent}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-(--color-muted)">
                  {advancePercent}% of total
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Contact">
            <button
              type="button"
              onClick={handleSendWhatsApp}
              disabled={whatsappLoading}
              className="inline-flex items-center justify-center gap-2 w-full rounded-2xl bg-(--color-primary) px-4 py-3 text-sm font-semibold text-white transition hover:bg-(--color-primary-dark) disabled:cursor-not-allowed disabled:opacity-60"
            >
              <MessageCircle size={18} />
              {whatsappLoading
                ? "Preparing WhatsApp…"
                : "Send WhatsApp Message"}
            </button>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
