import React, { useEffect, useState, useMemo } from "react";
import DataTable from "./DataTable";
import { getAppointments, getBarbers } from "../../lib/api";
import { formatCurrency } from "../../lib/utils";
import { formatoHoraCita, formatoFechaCita } from "../../lib/date-utils";

const statusConfig = {
  PENDING_PAYMENT: { label: "Pendiente Pago", classes: "bg-yellow-900/30 text-yellow-400" },
  CONFIRMED: { label: "Confirmado", classes: "bg-blue-900/30 text-blue-400" },
  IN_PROGRESS: { label: "En Progreso", classes: "bg-purple-900/30 text-purple-400" },
  COMPLETED: { label: "Completado", classes: "bg-green-900/30 text-green-400" },
  CANCELLED: { label: "Cancelado", classes: "bg-red-900/30 text-red-400" },
};

export default function AppointmentsContent() {
  const [appointments, setAppointments] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [barberFilter, setBarberFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  useEffect(() => {
    const load = async () => {
      try {
        const [appts, barbersData] = await Promise.all([
          getAppointments(),
          getBarbers(),
        ]);
        setAppointments(Array.isArray(appts) ? appts : []);
        setBarbers(Array.isArray(barbersData) ? barbersData : []);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    let result = appointments;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (a) =>
          a.client_name?.toLowerCase().includes(term) ||
          a.client_phone?.toLowerCase().includes(term) ||
          a.client_email?.toLowerCase().includes(term)
      );
    }

    if (statusFilter) {
      result = result.filter((a) => a.status === statusFilter);
    }

    if (barberFilter) {
      result = result.filter((a) => a.barber?.id === Number(barberFilter));
    }

    return result;
  }, [appointments, searchTerm, statusFilter, barberFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const columns = [
    { key: "id", label: "#", sortable: true },
    { key: "client_name", label: "Cliente", sortable: true },
    { key: "barber", label: "Barbero", render: (v) => v?.name || "-" },
    { key: "service", label: "Servicio", render: (v) => v?.name || "-" },
    { key: "start_time", label: "Fecha", sortable: true, render: (v) => formatoFechaCita(v) },
    { key: "_time", label: "Hora", render: (_, row) => formatoHoraCita(row.start_time) },
    {
      key: "status",
      label: "Estado",
      render: (v) => {
        const cfg = statusConfig[v] || { label: v, classes: "bg-gray-100 text-gray-800" };
        return (
          <span className={`px-2 py-1 rounded text-xs font-semibold ${cfg.classes}`}>
            {cfg.label}
          </span>
        );
      },
    },
    {
      key: "payment_status",
      label: "Pago",
      render: (v) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          v === "PAID" ? "bg-green-900/30 text-green-400" : "bg-yellow-900/30 text-yellow-400"
        }`}>
          {v === "PAID" ? "Pagado" : "Pendiente"}
        </span>
      ),
    },
    { key: "service", label: "Precio", render: (v) => (v?.price ? formatCurrency(v.price) : "-") },
  ];

  const from = filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const to = Math.min(currentPage * itemsPerPage, filtered.length);

  const pagStart = Math.max(1, currentPage - 2);
  const pagEnd = Math.min(totalPages, currentPage + 2);
  const pageNumbers = [];
  for (let i = pagStart; i <= pagEnd; i++) pageNumbers.push(i);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Gestión de Citas</h1>

      <div className="bg-[#131b2d] border border-[#1e1e1e] rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Buscar</label>
            <input
              type="text"
              placeholder="Nombre, teléfono o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-[#2a2a2a] rounded-lg text-sm text-white bg-[#1e1e1e] focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none placeholder:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Estado</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-[#2a2a2a] rounded-lg text-sm text-white bg-[#1e1e1e] focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none"
            >
              <option value="" className="bg-[#1e1e1e]">Todos</option>
              {Object.entries(statusConfig).map(([key, cfg]) => (
                <option key={key} value={key} className="bg-[#1e1e1e]">{cfg.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Barbero</label>
            <select
              value={barberFilter}
              onChange={(e) => setBarberFilter(e.target.value)}
              className="w-full px-3 py-2 border border-[#2a2a2a] rounded-lg text-sm text-white bg-[#1e1e1e] focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none"
            >
              <option value="" className="bg-[#1e1e1e]">Todos</option>
              {barbers.map((b) => (
                <option key={b.id} value={b.id} className="bg-[#1e1e1e]">{b.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Por página</label>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="w-full px-3 py-2 border border-[#2a2a2a] rounded-lg text-sm text-white bg-[#1e1e1e] focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none"
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n} className="bg-[#1e1e1e]">{n}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <DataTable
        title="Todas las Citas"
        columns={columns}
        data={paginated}
        loading={loading}
      />

      {totalPages > 1 && (
        <div className="bg-[#131b2d] border border-[#1e1e1e] rounded-b-lg shadow-md px-4 py-3 border-t border-[#1e1e1e] flex items-center justify-between">
          <span className="text-sm text-gray-400">
            Mostrando {from}–{to} de {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
            {filtered.length !== appointments.length && ` (filtrados de ${appointments.length})`}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded text-sm font-medium border border-[#2a2a2a] text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1e1e1e] transition-colors"
            >
              Anterior
            </button>
            {pagStart > 1 && (
              <>
                <button
                  onClick={() => setCurrentPage(1)}
                  className="px-3 py-1.5 rounded text-sm font-medium border border-[#2a2a2a] text-gray-300 hover:bg-[#1e1e1e] transition-colors"
                >
                  1
                </button>
                {pagStart > 2 && <span className="px-1 text-gray-500">···</span>}
              </>
            )}
            {pageNumbers.map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`px-3 py-1.5 rounded text-sm font-medium border transition-colors ${
                  p === currentPage
                    ? "bg-[#d4af37] text-[#0a0f1a] border-[#d4af37] font-bold"
                    : "border-[#2a2a2a] text-gray-300 hover:bg-[#1e1e1e]"
                }`}
              >
                {p}
              </button>
            ))}
            {pagEnd < totalPages && (
              <>
                {pagEnd < totalPages - 1 && <span className="px-1 text-gray-500">···</span>}
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="px-3 py-1.5 rounded text-sm font-medium border border-[#2a2a2a] text-gray-300 hover:bg-[#1e1e1e] transition-colors"
                >
                  {totalPages}
                </button>
              </>
            )}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded text-sm font-medium border border-[#2a2a2a] text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1e1e1e] transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
