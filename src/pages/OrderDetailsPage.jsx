import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
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
  Camera,
} from "lucide-react";
import { toast } from "sonner";

import { getOrderById } from "../api/orderApi";
import api from "../api/axios";
import StatusBadge from "../components/StatusBadge";
import UpdateStatusSelect from "../components/UpdateStatusSelect";
import PhotoGallery from "../components/photos/PhotoGallery";
import PhotoUploader from "../components/photos/PhotoUploader";

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={15} className="text-(--color-primary)" />
      </div>
      <div>
        <p className="text-xs text-(--color-muted) font-medium uppercase tracking-wide">
          {label}
        </p>
        <p className="font-medium text-(--color-text) mt-0.5">
          {value || <span className="text-(--color-muted) font-normal">—</span>}
        </p>
      </div>
    </div>
  );
}

function SectionCard({ title, children, action }) {
  return (
    <div className="bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-sm overflow-hidden">
      {title && (
        <div className="px-5 py-4 border-b border-(--color-border) flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-(--color-primary) rounded-full" />
            <h2 className="font-semibold text-(--color-text)">{title}</h2>
          </div>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

function MurtiPhotoSection({ item, orderId }) {
  return (
    <SectionCard
      title={`Photos — ${item.murtiName || "Murti"}`}
      action={
        <div className="flex items-center gap-1.5 text-xs text-(--color-muted)">
          <Camera size={13} />
          {(item.photos?.length ?? 0)} photo{(item.photos?.length ?? 0) !== 1 ? "s" : ""}
        </div>
      }
    >
      <div className="space-y-4">
        <PhotoGallery photos={item.photos || []} orderId={orderId} />
        <div className="border-t border-(--color-border) pt-3">
          <p className="text-xs text-(--color-muted) mb-2 font-medium uppercase tracking-wide">
            Upload New Photo
          </p>
          <PhotoUploader murtiItemId={item.id} orderId={orderId} />
        </div>
      </div>
    </SectionCard>
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
  });

  const handleSendWhatsApp = async () => {
    try {
      setWhatsappLoading(true);
      const response = await api.get(`/orders/${id}/whatsapp-message`);
      const { customerPhone, message } = response.data.data;
      const whatsappUrl = `https://wa.me/${customerPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
      toast.success("Opening WhatsApp...");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Unable to generate WhatsApp message";
      toast.error(errorMessage);
    } finally {
      setWhatsappLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-(--color-primary) border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-(--color-muted) text-sm">Loading order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-2">
          <p className="text-(--color-danger) font-semibold">Failed to load order</p>
          <p className="text-(--color-muted) text-sm">Please try again later.</p>
        </div>
      </div>
    );
  }

  const murtiItems = order.murtiItems || [];
  const firstMurti = murtiItems[0];
  const totalPrice = Number(order.totalPrice);
  const advancePaid = Number(order.advancePaid);
  const remainingAmount = totalPrice - advancePaid;
  const advancePercent =
    totalPrice > 0 ? Math.round((advancePaid / totalPrice) * 100) : 0;

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* ── BACK BUTTON ── */}
      <button
        onClick={() => navigate("/orders")}
        className="flex items-center gap-2 text-sm text-(--color-muted) hover:text-(--color-primary) transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Orders
      </button>

      {/* ── HERO HEADER ── */}
      <div className="bg-(--color-surface) border border-(--color-border) rounded-2xl shadow-sm overflow-hidden">
        <div className="h-1.5 bg-linear-to-r from-(--color-primary) to-(--color-primary-light)" />
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={order.status} />
                <span className="text-xs text-(--color-muted) bg-gray-100 px-2 py-0.5 rounded-full font-mono">
                  #{order.billNo}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-(--color-primary) leading-tight">
                {firstMurti?.murtiName || "Unnamed Murti"}
              </h1>
              <p className="text-(--color-muted) text-sm">
                {firstMurti?.murtiType} · Ordered on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="shrink-0">
              <p className="text-xs text-(--color-muted) font-medium uppercase tracking-wide mb-1.5">
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
                <InfoRow icon={Layers} label="Type" value={firstMurti?.murtiType} />
              </div>
              <div className="col-span-2 sm:col-span-2">
                <InfoRow
                  icon={Ruler}
                  label="Height"
                  value={firstMurti?.heightInches ? `${firstMurti.heightInches} inches` : null}
                />
              </div>
              <div className="col-span-2 sm:col-span-2">
                <InfoRow icon={Layers} label="Clay Type" value={firstMurti?.clayType} />
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
            {firstMurti?.specialInstructions && (
              <div className="mt-5 bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-start gap-3">
                <FileText size={16} className="text-(--color-primary) mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-(--color-primary) mb-1">
                    Special Instructions
                  </p>
                  <p className="text-sm text-(--color-text) leading-relaxed">
                    {firstMurti.specialInstructions}
                  </p>
                </div>
              </div>
            )}
          </SectionCard>

          {/* Photo sections — one per murti item */}
          {murtiItems.map((item) => (
            <MurtiPhotoSection key={item.id} item={item} orderId={id} />
          ))}

          {/* Notes */}
          {order.notes && (
            <SectionCard title="Order Notes">
              <p className="text-sm text-(--color-text) leading-relaxed">{order.notes}</p>
            </SectionCard>
          )}

          {/* Payment */}
          <SectionCard title="Payment Summary">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-(--color-muted) mb-1.5">
                  <span>Advance paid ({advancePercent}%)</span>
                  <span>Remaining ({100 - advancePercent}%)</span>
                </div>
                <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-(--color-primary) to-(--color-primary-light) transition-all duration-500"
                    style={{ width: `${advancePercent}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-(--color-muted) mb-1">Total</p>
                  <p className="text-lg font-bold text-(--color-text)">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-(--color-muted) mb-1">Paid</p>
                  <p className="text-lg font-bold text-(--color-success)">
                    ₹{advancePaid.toLocaleString("en-IN")}
                  </p>
                </div>
                <div
                  className={`rounded-xl p-3 text-center ${remainingAmount > 0 ? "bg-red-50" : "bg-green-50"}`}
                >
                  <p className="text-xs text-(--color-muted) mb-1">Remaining</p>
                  <p
                    className={`text-lg font-bold ${remainingAmount > 0 ? "text-(--color-danger)" : "text-(--color-success)"}`}
                  >
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

              <button
                onClick={handleSendWhatsApp}
                disabled={whatsappLoading}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-[#25d366] to-[#20ba5a] text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <MessageCircle size={16} />
                {whatsappLoading ? "Generating..." : "Send WhatsApp Confirmation"}
              </button>
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
