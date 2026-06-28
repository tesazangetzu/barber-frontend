import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import AdminSidebar from "./AdminSidebar.jsx";
import DashboardContent from "./DashboardContent.jsx";
import BarbersContent from "./BarbersContent.jsx";
import ServicesContent from "./ServicesContent.jsx";
import SchedulesContent from "./SchedulesContent.jsx";
import AppointmentsContent from "./AppointmentsContent.jsx";

const routes = {
  dashboard: {
    title: "Dashboard Admin",
    component: DashboardContent,
  },
  barbers: {
    title: "Gestión de Barberos",
    component: BarbersContent,
  },
  services: {
    title: "Gestión de Servicios",
    component: ServicesContent,
  },
  schedules: {
    title: "Gestión de Horarios",
    component: SchedulesContent,
  },
  appointments: {
    title: "Gestión de Citas",
    component: AppointmentsContent,
  },
};

function getRouteFromPath() {
  if (typeof window === "undefined") return "dashboard";
  const parts = window.location.pathname.split("/").filter(Boolean);
  const adminIndex = parts.indexOf("admin");
  const route = adminIndex >= 0 ? parts[adminIndex + 1] : null;
  return route && routes[route] ? route : "dashboard";
}

export default function AdminShell() {
  const [activeRoute, setActiveRoute] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const initialRoute = getRouteFromPath();
    setActiveRoute(initialRoute);

    const onPopState = () => {
      setActiveRoute(getRouteFromPath());
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const routeConfig = routes[activeRoute];
    document.title = routeConfig ? routeConfig.title : "Admin";
  }, [activeRoute]);

  const handleNavigate = (route) => {
    const path = route === "dashboard" ? "/admin/dashboard" : `/admin/${route}`;
    if (window.location.pathname !== path) {
      window.history.pushState(null, "", path);
      setActiveRoute(route);
    }
    // Close sidebar on mobile after navigation
    setSidebarOpen(false);
  };

  const closeSidebar = () => setSidebarOpen(false);

  const ActivePage =
    routes[activeRoute]?.component || routes.dashboard.component;

  return (
    <div className="flex flex-col md:flex-row min-h-screen md:pl-64">
      {/* Mobile header with hamburger */}
      <div className="md:hidden bg-blue-900 text-white p-4 flex items-center justify-between fixed top-0 left-0 right-0 z-40">
        <h1 className="text-lg font-bold">Panel Admin</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-20"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:shrink-0 top-16 md:top-0 left-0 h-screen w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0 z-30 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar
          activeRoute={activeRoute}
          onNavigate={handleNavigate}
          isMobile={typeof window !== "undefined" && window.innerWidth < 768}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 w-full md:w-auto pt-26 md:pt-12 p-4 md:p-8 min-h-screen">
        <ActivePage />
      </main>
    </div>
  );
}
