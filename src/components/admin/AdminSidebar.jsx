import React from "react";
import { Calendar, Users, Scissors, BarChart3, LogOut, CalendarCheck } from "lucide-react";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: BarChart3 },
  { key: "barbers", label: "Barberos", icon: Users },
  { key: "services", label: "Servicios", icon: Scissors },
  { key: "appointments", label: "Citas", icon: CalendarCheck },
  { key: "schedules", label: "Horarios", icon: Calendar },
];

export default function AdminSidebar({ activeRoute, onNavigate }) {
  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("barber");
    window.location.href = "/";
  };

  return (
    <aside className="w-full h-full bg-[#0a0f1a] border-r border-[#1e1e1e] text-white shadow-lg flex flex-col">
      <nav className="p-6 flex-1">
        <div className="mb-8 pb-6 border-b border-[#1e1e1e]">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 size={24} className="text-[#d4af37]" />
            <span>Panel Admin</span>
          </h2>
          <p className="text-[#d4af37]/70 text-sm mt-2">👑 Superusuario</p>
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
                  activeRoute === key
                    ? "bg-[#d4af37]/10 text-[#d4af37]"
                    : "text-gray-400 hover:bg-[#1e1e1e] hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-6 border-t border-[#1e1e1e]">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600/20 transition-colors duration-200 text-red-400 hover:text-red-300 cursor-pointer"
        >
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
