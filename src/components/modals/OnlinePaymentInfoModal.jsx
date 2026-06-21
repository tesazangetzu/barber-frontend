import React from "react";

export default function OnlinePaymentInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative max-w-sm w-full bg-surface/90 border border-surface/60 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-2">
          Pago en Línea - Próximamente
        </h3>
        <p className="text-xs text-secondary mb-4">
          La integración de pagos en línea (MercadoPago) estará disponible
          pronto. Por ahora registra pagos en efectivo o con terminal física.
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-accent text-surface font-bold hover:bg-accent/90 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
