import StatusBadge from "./StatusBadge";
import UpdateStatusSelect from "./UpdateStatusSelect";
export default function OrdersTable({ orders }) {
  return (
    <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-border)] overflow-x-auto">
      <table className="w-full min-w-[900px]">
        <thead>
          <tr className="border-b border-[var(--color-border)] text-left">
            <th className="p-4">Bill No</th>

            <th className="p-4">Customer</th>

            <th className="p-4">Phone</th>

            <th className="p-4">Total</th>

            <th className="p-4">Advance</th>

            <th className="p-4">Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-[var(--color-border)] hover:bg-slate-50"
            >
              <td className="p-4 font-medium">{order.billNo}</td>

              <td className="p-4">{order.customer.name}</td>

              <td className="p-4">{order.customer.phone}</td>

              <td className="p-4">₹{order.totalPrice}</td>

              <td className="p-4">₹{order.advancePaid}</td>

              <td className="p-4">
                <div className="space-y-2">
                  <StatusBadge status={order.status} />

                  <UpdateStatusSelect
                    orderId={order.id}
                    currentStatus={order.status}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
