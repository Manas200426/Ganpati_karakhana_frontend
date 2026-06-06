export default function RecentOrdersTable({ orders }) {
  return (
    <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-border)] p-5 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>

      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-[var(--color-border)] text-left">
            <th className="pb-3">Bill No</th>

            <th className="pb-3">Customer</th>

            <th className="pb-3">Status</th>

            <th className="pb-3">Amount</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-[var(--color-border)]"
            >
              <td className="py-3">{order.billNo}</td>

              <td className="py-3">{order.customer.name}</td>

              <td className="py-3">
                <span className="px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-900">
                  {order.status}
                </span>
              </td>

              <td className="py-3">₹{order.totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
