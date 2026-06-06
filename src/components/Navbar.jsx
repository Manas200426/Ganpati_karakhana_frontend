import MobileSidebar from "./MobileSidebar";

export default function Navbar() {
  return (
    <div className="h-16 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center justify-between px-4 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <MobileSidebar />

        <h1 className="text-lg font-bold text-[var(--color-primary)]">
          Ganpati Karkhana
        </h1>
      </div>
    </div>
  );
}
