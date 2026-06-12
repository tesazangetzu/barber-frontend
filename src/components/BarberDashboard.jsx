import React, { useState, useEffect } from "react";

const API_BASE = import.meta.env.PUBLIC_API_BASE;

const getLimaDateStr = (date) =>
  date.toLocaleDateString("en-CA", { timeZone: "America/Lima" });

export default function BarberDashboard() {
  const [barber, setBarber] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    getLimaDateStr(new Date()),
  );
  const [paymentModalApp, setPaymentModalApp] = useState(null);
  const [localPaymentMethod, setLocalPaymentMethod] = useState("LOCAL_CASH"); // LOCAL_CASH or LOCAL_CARD
  const [showOnlineModalBarber, setShowOnlineModalBarber] = useState(false);

  // Check auth and session
  useEffect(() => {
    const storedBarber = localStorage.getItem("barber");
    const storedAdmin = localStorage.getItem("admin");

    if (!storedBarber && !storedAdmin) {
      window.location.href = "/login";
      return;
    }

    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
      setLoading(false);
      return;
    }

    if (storedBarber) {
      setBarber(JSON.parse(storedBarber));
    }
  }, []);

  // Fetch appointments once barber and selectedDate are resolved
  useEffect(() => {
    if (!barber) return;
    fetchAppointments();
  }, [barber, selectedDate]);

  const fetchAppointments = async () => {
    setLoading(true);
    setError("");
    const token = barber?.access_token;

    try {
      const params = new URLSearchParams({
        barber_id: barber.id,
        start_date: selectedDate,
        end_date: selectedDate,
        order: "ASC",
      });

      const res = await fetch(`${API_BASE}/appointments?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("No se pudo recuperar la agenda del barbero.");
      }

      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.warn("Error al obtener la agenda desde el backend.", err);
      setError("No se pudo cargar la agenda.");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    const token = barber?.access_token;

    try {
      const res = await fetch(`${API_BASE}/appointments/${appId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Error al actualizar el estado de la cita.");
      }

      fetchAppointments();
    } catch (err) {
      alert(err.message);
    }
  };

  const openPaymentModal = (app) => {
    setPaymentModalApp(app);
  };

  const submitLocalPayment = async () => {
    if (!paymentModalApp) return;
    const token = barber?.access_token;
    const appId = paymentModalApp.id;

    try {
      const res = await fetch(`${API_BASE}/appointments/${appId}/payment`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          payment_status: "PAID",
          payment_method: "LOCAL",
          payment_id:
            localPaymentMethod === "LOCAL_CASH" ? "LOCAL_CASH" : "LOCAL_CARD",
        }),
      });

      if (!res.ok) {
        throw new Error("Error al registrar el pago.");
      }

      setPaymentModalApp(null);
      fetchAppointments();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("barber");
      localStorage.removeItem("admin");
    } catch (e) {
      console.warn("Error limpiando localStorage", e);
    }
    window.location.href = "/login";
  };

  if (admin) {
    return (
      <div className="w-full flex flex-col min-h-screen pb-12">
        <div className="bg-surface/40 border border-surface/50 rounded-2xl p-4 mb-6 flex justify-between items-center relative overflow-hidden">
          <div className="absolute left-0 top-0 w-32 h-32 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-accent/10 border border-accent/35 flex items-center justify-center text-xl shrink-0">
              👑
            </div>
            <div>
              <h2 className="font-bold text-white text-sm leading-snug">
                Panel de Superusuario
              </h2>
              <span className="text-[10px] text-accent font-semibold uppercase tracking-wider block">
                Acceso Administrativo
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg border border-surface text-[10px] font-bold text-secondary hover:text-error hover:border-error/20 transition-all"
          >
            Salir
          </button>
        </div>

        <div className="grid gap-4">
          <div className="bg-surface/20 border border-surface/50 rounded-2xl p-6">
            <h3 className="text-white font-bold text-sm mb-2">
              Bienvenido, superusuario
            </h3>
            <p className="text-secondary text-sm leading-relaxed">
              Has iniciado sesión como superusuario. Desde aquí puedes ver el
              estado general de la aplicación y gestionar elementos
              administrativos.
            </p>
          </div>

          <div className="bg-surface/20 border border-surface/50 rounded-2xl p-6">
            <h4 className="text-white text-xs uppercase tracking-wider font-semibold mb-2">
              Estado de sesión
            </h4>
            <div className="text-secondary text-sm">
              <p>
                <span className="font-semibold text-white">Email:</span>{" "}
                {admin.email}
              </p>
              <p>
                <span className="font-semibold text-white">Rol:</span>{" "}
                {admin.role}
              </p>
            </div>
          </div>

          <div className="bg-surface/20 border border-surface/50 rounded-2xl p-6">
            <h4 className="text-white text-xs uppercase tracking-wider font-semibold mb-2">
              Acciones rápidas
            </h4>
            <p className="text-secondary text-sm leading-relaxed">
              Actualmente no hay vistas administrativas específicas en esta
              interfaz. Puedes acceder a las funcionalidades de administración
              desde el backend o ampliar el panel más adelante.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formatTime = (isoString) => {
    const d = new Date(isoString);
    const limaHours = (d.getUTCHours() - 5 + 24) % 24;
    const mins = String(d.getUTCMinutes()).padStart(2, "0");
    return `${String(limaHours).padStart(2, "0")}:${mins}`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-secondary/10 text-secondary border border-secondary/20">
            Esperando Pago
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-success/10 text-success border border-success/20">
            Confirmado
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent/10 text-accent border border-accent/20 animate-pulse">
            En Proceso
          </span>
        );
      case "COMPLETED":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface text-secondary border border-surface/50">
            Completado
          </span>
        );
      case "CANCELLED":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-error/10 text-error border border-error/20">
            Cancelado
          </span>
        );
      default:
        return null;
    }
  };

  const getPaymentBadge = (payStatus, payMethod) => {
    if (payStatus === "PAID") {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] text-success font-bold bg-success/10 px-2 py-0.5 rounded border border-success/20">
          💰 Pagado ({payMethod === "ONLINE" ? "MercadoPago" : "Local"})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-secondary font-bold bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20">
        ⌛ Pago Pendiente
      </span>
    );
  };

  if (!barber) {
    return (
      <div className="py-20 text-center text-xs text-secondary animate-pulse">
        Verificando credenciales...
      </div>
    );
  }

  // Get date navigation days (Yesterday, Today, Tomorrow)
  const getNavDays = () => {
    const days = [];
    const today = new Date();
    for (let i = -1; i <= 2; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const dateStr = getLimaDateStr(d);
      days.push({
        dateStr,
        label:
          i === 0
            ? "Hoy"
            : i === 1
              ? "Mañana"
              : d.toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                  timeZone: "America/Lima",
                }),
      });
    }
    return days;
  };

  return (
    <div className="w-full flex flex-col min-h-screen pb-12">
      {/* Top Header Card */}
      <div className="bg-surface/40 border border-surface/50 rounded-2xl p-4 mb-6 flex justify-between items-center relative overflow-hidden">
        {/* Glow */}
        <div className="absolute left-0 top-0 w-32 h-32 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-accent/10 border border-accent/35 flex items-center justify-center text-xl shrink-0">
            🧔🏻‍♂️
          </div>
          <div>
            <h2 className="font-bold text-white text-sm leading-snug">
              {barber.name}
            </h2>
            <span className="text-[10px] text-accent font-semibold uppercase tracking-wider block">
              Panel de Control
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-3 py-1.5 rounded-lg border border-surface text-[10px] font-bold text-secondary hover:text-error hover:border-error/20 transition-all"
        >
          Salir
        </button>
      </div>

      {/* Date Navigation */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-6 border-b border-surface/80">
        {getNavDays().map((day) => (
          <button
            key={day.dateStr}
            onClick={() => setSelectedDate(day.dateStr)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedDate === day.dateStr
                ? "bg-accent text-surface shadow-md shadow-accent/10"
                : "bg-surface/30 text-secondary hover:bg-surface hover:text-white"
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      {/* Agenda Section */}
      <div className="grow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-serif">
            Agenda del Día
          </h3>
          <span className="text-[10px] text-secondary font-mono font-bold">
            {selectedDate}
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-secondary animate-pulse">
            Obteniendo citas programadas...
          </div>
        ) : appointments.length > 0 ? (
          <div className="flex flex-col gap-4">
            {appointments.map((app) => (
              <div
                key={app.id}
                className={`p-4 rounded-2xl border transition-all ${
                  app.status === "IN_PROGRESS"
                    ? "bg-accent/10 border-accent/50 shadow-md shadow-accent/5"
                    : app.status === "COMPLETED"
                      ? "bg-surface/10 border-surface/60 opacity-60"
                      : "bg-surface/20 border-surface/50"
                }`}
              >
                {/* Time & Badges */}
                <div className="flex justify-between items-start mb-3 border-b border-surface/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-mono">
                      ⏰ {formatTime(app.start_time)}
                    </span>
                    <span className="text-[9px] text-secondary bg-surface px-1.5 py-0.5 rounded font-mono">
                      #{app.id}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {getStatusBadge(app.status)}
                    {getPaymentBadge(app.payment_status, app.payment_method)}
                  </div>
                </div>

                {/* Details */}
                <div className="mb-4 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-xs leading-none mb-1">
                        {app.client_name}
                      </h4>
                      <p className="text-[10px] text-secondary">
                        📞 {app.client_phone}
                      </p>
                      {app.client_email && (
                        <p className="text-[9px] text-secondary">
                          {app.client_email}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-secondary block leading-tight">
                        {app.service.name}
                      </span>
                      <span className="text-accent font-serif font-bold text-sm">
                        ${Number(app.service.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Panel */}
                {app.status !== "CANCELLED" && app.status !== "COMPLETED" && (
                  <div className="flex gap-2 border-t border-surface/50 pt-3">
                    {app.status === "CONFIRMED" && (
                      <button
                        onClick={() =>
                          handleStatusChange(app.id, "IN_PROGRESS")
                        }
                        className="grow py-2 rounded-xl bg-accent text-surface font-bold text-xs hover:bg-accent/90 transition-colors"
                      >
                        Iniciar Servicio 💈
                      </button>
                    )}
                    {app.status === "IN_PROGRESS" && (
                      <button
                        onClick={() => handleStatusChange(app.id, "COMPLETED")}
                        className="grow py-2 rounded-xl bg-success text-white font-bold text-xs hover:bg-success/90 transition-colors"
                      >
                        Finalizar Servicio ✅
                      </button>
                    )}
                    {app.payment_status === "PENDING" && (
                      <button
                        onClick={() => openPaymentModal(app)}
                        className="py-2 px-3 rounded-xl border border-surface hover:bg-surface text-[11px] font-bold text-accent transition-colors shrink-0"
                      >
                        💵 Cobrar
                      </button>
                    )}
                    <button
                      onClick={() => handleStatusChange(app.id, "CANCELLED")}
                      className="p-2 rounded-xl border border-surface text-secondary hover:text-error hover:border-error/10 transition-colors"
                      title="Cancelar Cita"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-xs text-secondary bg-surface/10 border border-surface/20 rounded-2xl flex flex-col items-center justify-center gap-2">
            <span>📅</span>
            <span>No hay citas programadas para este día.</span>
          </div>
        )}
      </div>

      {/* Local Payment Modal */}
      {paymentModalApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-surface/90 border border-surface rounded-2xl p-5 shadow-2xl animate-scaleUp">
            <h3 className="font-serif font-bold text-white text-base mb-1">
              Registrar Pago Local
            </h3>
            <p className="text-[11px] text-secondary mb-4">
              Confirma la recepción del cobro presencial para la cita de{" "}
              {paymentModalApp.client_name}.
            </p>

            <div className="p-3 bg-surface/20 border border-surface/30 rounded-xl flex justify-between items-center mb-4">
              <span className="text-xs text-secondary">
                {paymentModalApp.service.name}
              </span>
              <span className="text-accent font-serif font-bold text-base">
                ${Number(paymentModalApp.service.price).toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col gap-2.5 mb-6">
              <label className="block text-[10px] font-semibold text-secondary uppercase tracking-wider">
                Método de cobro
              </label>

              <div
                onClick={() => setLocalPaymentMethod("LOCAL_CASH")}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                  localPaymentMethod === "LOCAL_CASH"
                    ? "bg-accent/10 border-accent text-white"
                    : "bg-surface/30 border-surface/40 text-secondary hover:border-surface/60"
                }`}
              >
                <span className="text-lg">💵</span>
                <span className="text-xs font-bold">Efectivo</span>
              </div>

              <div
                onClick={() => setLocalPaymentMethod("LOCAL_CARD")}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                  localPaymentMethod === "LOCAL_CARD"
                    ? "bg-accent/10 border-accent text-white"
                    : "bg-surface/30 border-surface/40 text-secondary hover:border-surface/60"
                }`}
              >
                <span className="text-lg">💳</span>
                <span className="text-xs font-bold">
                  Terminal Física (Tarjeta)
                </span>
              </div>

              <div
                onClick={() => {
                  setPaymentModalApp(null);
                  setShowOnlineModalBarber(true);
                }}
                className="p-3 rounded-xl border border-surface/40 text-secondary hover:border-surface/60 hover:text-white cursor-pointer transition-all flex items-center gap-3"
              >
                <span className="text-lg">🌐</span>
                <span className="text-xs font-bold">
                  Pago en Línea (MercadoPago)
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setPaymentModalApp(null)}
                className="flex-1 py-2.5 rounded-xl border border-surface hover:bg-surface text-secondary font-bold text-xs transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={submitLocalPayment}
                className="flex-1 py-2.5 rounded-xl bg-accent text-surface font-bold text-xs hover:bg-accent/90 transition-colors"
              >
                Cobrado ✅
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal: Pago en línea próximamente (Barber Dashboard) */}
      {showOnlineModalBarber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowOnlineModalBarber(false)}
          />
          <div className="relative max-w-sm w-full bg-surface/90 border border-surface/60 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-2">
              Pago en Línea - Próximamente
            </h3>
            <p className="text-xs text-secondary mb-4">
              La integración de pagos en línea (MercadoPago) estará disponible
              pronto. Por ahora registra pagos en efectivo o con terminal
              física.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowOnlineModalBarber(false)}
                className="px-4 py-2 rounded-lg bg-accent text-surface font-bold hover:bg-accent/90 transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
