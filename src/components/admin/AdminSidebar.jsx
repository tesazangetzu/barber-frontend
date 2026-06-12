import React from "react";
import { Calendar, Users, Scissors, BarChart3, LogOut } from "lucide-react";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: BarChart3 },
  { key: "barbers", label: "Barberos", icon: Users },
  { key: "services", label: "Servicios", icon: Scissors },
  { key: "schedules", label: "Horarios", icon: Calendar },
];

export default function AdminSidebar({ activeRoute, onNavigate }) {
  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("barber");
    window.location.href = "/";
  };

  return (
    <aside className="w-full h-full bg-linear-to-b from-blue-900 to-blue-800 text-white shadow-lg flex flex-col">
      <nav className="p-6 flex-1">
        <div className="mb-8 pb-6 border-b border-blue-700">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 size={24} />
            <span>Panel Admin</span>
          </h2>
          <p className="text-blue-200 text-sm mt-2">👑 Superusuario</p>
        </div>

        <ul className="space-y-2">
          {navItems.map(({ key, label, icon: Icon }) => (
            <li key={key}>
              <a
                href={
                  key === "dashboard" ? "/admin/dashboard" : `/admin/${key}`
                }
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate(key);
                }}
                className={`flex w-full items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  activeRoute === key ? "bg-blue-700" : "hover:bg-blue-700"
                }`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout button at bottom */}
      <div className="p-6 border-t border-blue-700">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition-colors duration-200 text-red-100 hover:text-white"
        >
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
