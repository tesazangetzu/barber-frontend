import React, { useEffect, useState } from "react";
import {
  StatsOverview,
  AppointmentsChart,
  RevenueChart,
  AppointmentStatusChart,
} from "./Charts";
import { getBarbers, getServices, getAppointments } from "../../lib/api";
import { generateChartData } from "../../lib/utils";

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

        // Calculate stats
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

        // Generate chart data
        const appointmentData = generateChartData(7);
        const revenueData = generateChartData(7);
        const statusData = [
          {
            name: "Completadas",
            count: Math.floor(appointmentsData.length * 0.7),
          },
          {
            name: "Pendientes",
            count: Math.floor(appointmentsData.length * 0.2),
          },
          {
            name: "Canceladas",
            count: Math.floor(appointmentsData.length * 0.1),
          },
        ];

        setChartData({
          appointments: appointmentData,
          revenue: revenueData,
          status: statusData,
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
