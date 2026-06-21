import React from "react";

export default function EditServiceModal({
  app,
  services,
  selectedServiceId,
  onServiceChange,
  onSubmit,
  onClose,
}) {
  if (!app) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xs bg-surface/90 border border-surface rounded-2xl p-5 shadow-2xl animate-scaleUp">
        <h3 className="font-serif font-bold text-white text-base mb-1">
          Editar Servicio
        </h3>
        <p className="text-[11px] text-secondary mb-4">
          Cambia el servicio para la cita de {app.client_name}.
        </p>

        <div className="space-y-2 mb-6">
          {services.map((svc) => (
            <div
              key={svc.id}
              onClick={() => onServiceChange(svc.id)}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                selectedServiceId === svc.id
                  ? "bg-accent/10 border-accent text-white"
                  : "bg-surface/30 border-surface/40 text-secondary hover:border-surface/60"
              }`}
            >
              <div className="grow">
                <span className="text-xs font-bold block">{svc.name}</span>
                <span className="text-[10px] text-secondary">
                  {svc.duration_minutes} min
                </span>
              </div>
              <span className="text-accent font-serif font-bold text-sm">
                S/ {Number(svc.price).toFixed(2)}
              </span>
            </div>
          ))}
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
            disabled={selectedServiceId === app.service.id}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-colors ${
              selectedServiceId === app.service.id
                ? "bg-surface/30 text-secondary cursor-not-allowed"
                : "bg-accent text-surface hover:bg-accent/90"
            }`}
          >
            Guardar ✅
          </button>
        </div>
      </div>
    </div>
  );
}
