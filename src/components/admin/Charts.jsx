import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, Scissors, Calendar, DollarSign } from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function StatsOverview({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-[#131b2d] border border-[#1e1e1e] rounded-lg shadow p-6 border-l-4 border-blue-500">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-sm">Barberos</p>
            <p className="text-3xl font-bold text-white">
              {stats?.barbers || 0}
            </p>
          </div>
          <Users size={32} className="text-blue-500 opacity-50" />
        </div>
      </div>

      <div className="bg-[#131b2d] border border-[#1e1e1e] rounded-lg shadow p-6 border-l-4 border-green-500">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-sm">Servicios</p>
            <p className="text-3xl font-bold text-white">
              {stats?.services || 0}
            </p>
          </div>
          <Scissors size={32} className="text-green-500 opacity-50" />
        </div>
      </div>

      <div className="bg-[#131b2d] border border-[#1e1e1e] rounded-lg shadow p-6 border-l-4 border-orange-500">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-sm">Citas Totales</p>
            <p className="text-3xl font-bold text-white">
              {stats?.totalAppointments || 0}
            </p>
          </div>
          <Calendar size={32} className="text-orange-500 opacity-50" />
        </div>
      </div>

      <div className="bg-[#131b2d] border border-[#1e1e1e] rounded-lg shadow p-6 border-l-4 border-red-500">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-sm">Ingresos Totales</p>
            <p className="text-3xl font-bold text-white">
              S/ {stats?.totalRevenue.toFixed(2) || 0}
            </p>
          </div>
          <DollarSign size={32} className="text-red-500 opacity-50" />
        </div>
      </div>
    </div>
  );
}

export function AppointmentsChart({ data }) {
  return (
    <div className="bg-[#131b2d] border border-[#1e1e1e] rounded-lg shadow p-6 mb-8">
      <h3 className="text-lg font-bold text-white mb-6">Citas por Día</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#3b82f6" name="Citas" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RevenueChart({ data }) {
  return (
    <div className="bg-[#131b2d] border border-[#1e1e1e] rounded-lg shadow p-6 mb-8">
      <h3 className="text-lg font-bold text-white mb-6">Ingresos por Día</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `S/${value.toFixed(2)}`} />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#10b981"
            name="Ingresos (S/)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AppointmentStatusChart({ data }) {
  return (
    <div className="bg-[#131b2d] border border-[#1e1e1e] rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-white mb-6">Estado de Citas</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
