import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";

import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Navbar />

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}