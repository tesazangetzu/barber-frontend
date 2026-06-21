import React from "react";

export default function PaymentModal({
  app,
  localPaymentMethod,
  onMethodChange,
  onSubmit,
  onClose,
  onOnlineClick,
}) {
  if (!app) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xs bg-surface/90 border border-surface rounded-2xl p-5 shadow-2xl animate-scaleUp">
        <h3 className="font-serif font-bold text-white text-base mb-1">
          Registrar Pago Local
        </h3>
        <p className="text-[11px] text-secondary mb-4">
          Confirma la recepción del cobro presencial para la cita de{" "}
          {app.client_name}.
        </p>

        <div className="p-3 bg-surface/20 border border-surface/30 rounded-xl flex justify-between items-center mb-4">
          <span className="text-xs text-secondary">{app.service.name}</span>
          <span className="text-accent font-serif font-bold text-base">
            ${Number(app.service.price).toFixed(2)}
          </span>
        </div>

        <div className="flex flex-col gap-2.5 mb-6">
          <label className="block text-[10px] font-semibold text-secondary uppercase tracking-wider">
            Método de cobro
          </label>

          <div
            onClick={() => onMethodChange("LOCAL_CASH")}
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
            onClick={() => onMethodChange("LOCAL_CARD")}
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
            onClick={onOnlineClick}
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
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-surface hover:bg-surface text-secondary font-bold text-xs transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 py-2.5 rounded-xl bg-accent text-surface font-bold text-xs hover:bg-accent/90 transition-colors"
          >
            Cobrado ✅
          </button>
        </div>
      </div>
    </div>
  );
}
