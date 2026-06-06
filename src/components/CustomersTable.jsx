export default function CustomersTable({ customers }) {
  return (
    <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-border)] overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="border-b border-[var(--color-border)] text-left">
            <th className="p-4">Name</th>

            <th className="p-4">Phone</th>

            <th className="p-4">Address</th>

            <th className="p-4">Total Orders</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr
              key={customer.id}
              className="border-b border-[var(--color-border)] hover:bg-slate-50"
            >
              <td className="p-4 font-medium">{customer.name}</td>

              <td className="p-4">{customer.phone}</td>

              <td className="p-4">{customer.address}</td>

              <td className="p-4">{customer.orders?.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
