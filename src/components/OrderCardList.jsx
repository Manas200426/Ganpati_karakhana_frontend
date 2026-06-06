import OrderCard from "./OrderCard";

export default function OrderCardList({ orders }) {
  if (!orders.length) {
    return (
      <div className="bg-white border border-[var(--color-border)] rounded-2xl p-10 text-center text-[var(--color-muted)]">
        No orders found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
