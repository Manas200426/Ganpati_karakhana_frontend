export default function StatCard({ title, value, icon }) {
  return (
    <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-border)] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--color-muted)]">{title}</p>

          <h2 className="text-2xl font-bold mt-2 text-[var(--color-text)]">
            {value}
          </h2>
        </div>

        <div className="bg-purple-100 p-3 rounded-xl">{icon}</div>
      </div>
    </div>
  );
}
