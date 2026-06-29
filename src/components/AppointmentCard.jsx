import { formatoHoraCita } from "../lib/date-utils";

export default function AppointmentCard({
  app,
  onStatusChange,
  onOpenPaymentModal,
  onShowOnlineModal,
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="text-[9px] text-white bg-accent px-2 py-1 rounded font-mono">
            Confirmada
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="text-[9px] text-white bg-accent px-2 py-1 rounded font-mono">
            En Progreso
          </span>
        );
      case "COMPLETED":
        return (
          <span className="text-[9px] text-white bg-success px-2 py-1 rounded font-mono">
            Completada
          </span>
        );
      case "CANCELLED":
        return (
          <span className="text-[9px] text-white bg-error px-2 py-1 rounded font-mono">
            Cancelada
          </span>
        );
      default:
        return null;
    }
  };

  const getPaymentBadge = (paymentStatus) => {
    if (paymentStatus === "PAID") {
      return (
        <span className="text-[9px] text-white bg-success px-2 py-1 rounded font-mono">
          Pagada
        </span>
      );
    }
    return (
      <span className="text-[9px] text-white bg-warning px-2 py-1 rounded font-mono">
        Pendiente
      </span>
    );
  };

  return (
    <div
      className={`p-4 rounded-2xl border transition-all ${
        app.status === "IN_PROGRESS"
          ? "bg-accent/10 border-accent/50 shadow-md shadow-accent/5"
          : app.status === "COMPLETED"
            ? "bg-surface/10 border-surface/60 opacity-60"
            : "bg-surface/20 border-surface/50"
      }`}
    >
      <div className="flex justify-between items-start mb-3 border-b border-surface/60 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white font-mono">
            ⏰ {formatoHoraCita(app.start_time)}
          </span>
          <span className="text-[9px] text-secondary bg-surface px-1.5 py-0.5 rounded font-mono">
            #{app.id}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          {getStatusBadge(app.status)}
          {getPaymentBadge(app.payment_status)}
        </div>
      </div>

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
              <p className="text-[9px] text-secondary">{app.client_email}</p>
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

      {app.status !== "CANCELLED" && app.status !== "COMPLETED" && (
        <div className="flex gap-2 border-t border-surface/50 pt-3">
          {app.status === "CONFIRMED" && (
            <button
              onClick={() => onStatusChange(app.id, "IN_PROGRESS")}
              className="grow py-2 rounded-xl bg-accent text-surface font-bold text-xs hover:bg-accent/90 transition-colors"
            >
              Iniciar Servicio 💈
            </button>
          )}
          {app.status === "IN_PROGRESS" && (
            <button
              onClick={() => onStatusChange(app.id, "COMPLETED")}
              className="grow py-2 rounded-xl bg-success text-white font-bold text-xs hover:bg-success/90 transition-colors"
            >
              Finalizar Servicio ✅
            </button>
          )}
          {app.payment_status === "PENDING" && (
            <button
              onClick={() => onOpenPaymentModal(app)}
              className="py-2 px-3 rounded-xl border border-surface hover:bg-surface text-[11px] font-bold text-accent transition-colors shrink-0"
            >
              💵 Cobrar
            </button>
          )}
          <button
            onClick={() => onStatusChange(app.id, "CANCELLED")}
            className="p-2 rounded-xl border border-surface text-secondary hover:text-error hover:border-error/10 transition-colors"
            title="Cancelar Cita"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
}
