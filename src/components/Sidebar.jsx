import {
  Link,
  useNavigate,
} from "react-router-dom";

import useAuthStore from "../store/authStore";

export default function Sidebar() {
  const navigate = useNavigate();

  const logout =
    useAuthStore(
      (state) => state.logout
    );

  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  return (
    <div className="w-64 bg-[var(--color-surface)] shadow-sm border-r border-[var(--color-border)] hidden md:flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-[var(--color-primary)]">
          Karkhana
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link
          to="/"
          className="block p-3 rounded-xl hover:bg-purple-100 transition"
        >
          Dashboard
        </Link>

        <Link
          to="/customers"
          className="block p-3 rounded-xl hover:bg-purple-100 transition"
        >
          Customers
        </Link>

        <Link
          to="/orders"
          className="block p-3 rounded-xl hover:bg-purple-100 transition"
        >
          Orders
        </Link>
      </nav>

      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full bg-[var(--color-primary)] text-white rounded-lg p-2"
        >
          Logout
        </button>
      </div>
    </div>
  );
}