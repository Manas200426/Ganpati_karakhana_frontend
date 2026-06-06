import { Menu } from "lucide-react";

import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { Link, useNavigate } from "react-router-dom";

import useAuthStore from "../store/authStore";

export default function MobileSidebar() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="md:hidden">
          <Menu size={28} />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="w-64 p-0">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex flex-col h-full bg-white">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-[var(--color-primary)]">
              Karkhana
            </h1>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <SheetClose asChild>
              <Link to="/" className="block p-3 rounded-lg hover:bg-purple-100">
                Dashboard
              </Link>
            </SheetClose>

            <SheetClose asChild>
              <Link
                to="/customers"
                className="block p-3 rounded-lg hover:bg-purple-100"
              >
                Customers
              </Link>
            </SheetClose>

            <SheetClose asChild>
              <Link
                to="/orders"
                className="block p-3 rounded-lg hover:bg-purple-100"
              >
                Orders
              </Link>
            </SheetClose>
          </nav>

          <div className="p-4">
            <SheetClose asChild>
              <button
                onClick={handleLogout}
                className="w-full bg-[var(--color-primary)] text-white rounded-xl p-3"
              >
                Logout
              </button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
