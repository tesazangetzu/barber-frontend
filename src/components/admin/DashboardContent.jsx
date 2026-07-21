import React, { useEffect, useState } from "react";
import {
  StatsOverview,
  AppointmentsChart,
  RevenueChart,
  AppointmentStatusChart,
} from "./Charts";
import { getBarbers, getServices, getAppointments } from "../../lib/api";

function groupByDate(appointments, getValue) {
  const map = {};
  for (const apt of appointments) {
    const date = apt.start_time ? apt.start_time.substring(0, 10) : "unknown";
    if (!map[date]) map[date] = { count: 0, revenue: 0 };
    map[date].count += 1;
    map[date].revenue += Number(apt.service?.price) || 0;
  }
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)
    .map(([name, val]) => ({
      name,
      count: val.count,
      revenue: val.revenue,
    }));
}

function countByStatus(appointments) {
  const counts = {};
  for (const apt of appointments) {
    const status = apt.status || "UNKNOWN";
    counts[status] = (counts[status] || 0) + 1;
  }
  const labels = {
    COMPLETED: "Completadas",
    CONFIRMED: "Confirmadas",
    PENDING_PAYMENT: "Pendientes Pago",
    IN_PROGRESS: "En Progreso",
    CANCELLED: "Canceladas",
  };
  return Object.entries(counts).map(([key, value]) => ({
    name: labels[key] || key,
    count: value,
  }));
}

export default function DashboardContent() {
  const [stats, setStats] = useState({
    barbers: 0,
    services: 0,
    totalAppointments: 0,
    totalRevenue: 0,
  });
  const [chartData, setChartData] = useState({
    appointments: [],
    revenue: [],
    status: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [barbersData, servicesData, appointmentsData] = await Promise.all(
          [getBarbers(), getServices(), getAppointments()],
        );

        const totalRevenue = appointmentsData.reduce(
          (sum, apt) => sum + (Number(apt.service?.price) || 0),
          0,
        );

        setStats({
          barbers: barbersData.length || 0,
          services: servicesData.length || 0,
          totalAppointments: appointmentsData.length || 0,
          totalRevenue,
        });

        const grouped = groupByDate(appointmentsData);
        setChartData({
          appointments: grouped.map(({ name, count }) => ({ name, count })),
          revenue: grouped.map(({ name, revenue }) => ({ name, revenue })),
          status: countByStatus(appointmentsData),
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">
        👑 Panel de Administración
      </h1>

      <StatsOverview stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <AppointmentsChart data={chartData.appointments} />
        <RevenueChart data={chartData.revenue} />
      </div>

      <AppointmentStatusChart data={chartData.status} />
    </div>
  );
}
