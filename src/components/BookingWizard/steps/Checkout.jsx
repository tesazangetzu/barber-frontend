import Button from "../../Button";

export function Checkout({
  selectedService,
  selectedBarber,
  selectedDate,
  selectedSlot,
  paymentMethod,
  PAYMENT_METHOD,
  clientName,
  clientPhone,
  clientEmail,
  onClientNameChange,
  onClientPhoneChange,
  onClientEmailChange,
  onPaymentMethodChange,
  onSubmit,
  onPrev,
  loading,
  error,
  showOnlineModal,
  onCloseOnlineModal,
}) {
  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-lg font-serif font-bold text-white mb-1">
        Tus Datos & Pago
      </h2>
      <p className="text-xs text-secondary mb-4">
        Ingresa tu información de contacto para confirmar tu reserva.
      </p>

      <div className="flex flex-col gap-3.5">
        <div>
          <label className="block text-[11px] font-semibold text-secondary uppercase tracking-wider mb-1.5">
            Nombre Completo
          </label>
          <input
            type="text"
            required
            value={clientName}
            onChange={(e) => onClientNameChange(e.target.value)}
            placeholder="Ej. Juan Pérez"
            className="w-full px-4 py-3 rounded-xl bg-surface/30 border border-surface focus:border-accent focus:ring-1 focus:ring-accent text-sm text-primary placeholder:text-secondary outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-secondary uppercase tracking-wider mb-1.5">
            Número de Celular
          </label>
          <input
            type="tel"
            required
            value={clientPhone}
            onChange={(e) => onClientPhoneChange(e.target.value)}
            placeholder="Ej. +52 55 1234 5678"
            className="w-full px-4 py-3 rounded-xl bg-surface/30 border border-surface focus:border-accent focus:ring-1 focus:ring-accent text-sm text-primary placeholder:text-secondary outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-secondary uppercase tracking-wider mb-1.5">
            Correo Electrónico
          </label>
          <input
            type="email"
            required
            value={clientEmail}
            onChange={(e) => onClientEmailChange(e.target.value)}
            placeholder="Ej. juan@correo.com"
            className="w-full px-4 py-3 rounded-xl bg-surface/30 border border-surface focus:border-accent focus:ring-1 focus:ring-accent text-sm text-primary placeholder:text-secondary outline-none transition-all"
          />
        </div>

        <div className="mt-2 border-t border-surface/50 pt-4">
          <label className="block text-[11px] font-semibold text-secondary uppercase tracking-wider mb-2">
            Método de Pago
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div
              onClick={() => onPaymentMethodChange(PAYMENT_METHOD.LOCAL)}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col gap-1.5 ${
                paymentMethod === PAYMENT_METHOD.LOCAL
                  ? "bg-accent/10 border-accent"
                  : "bg-surface/30 border-surface/40 hover:border-surface/60"
              }`}
            >
              <span className="text-xl">💵</span>
              <div className="text-left">
                <h4 className="text-xs font-bold text-white">Pago Local</h4>
                <p className="text-[10px] text-secondary leading-tight">
                  Paga al barbero con efectivo/tarjeta.
                </p>
              </div>
            </div>
            <div
              onClick={() => onPaymentMethodChange(PAYMENT_METHOD.ONLINE)}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col gap-1.5 ${
                paymentMethod === PAYMENT_METHOD.ONLINE
                  ? "bg-accent/10 border-accent"
                  : "bg-surface/30 border-surface/40 hover:border-surface/60"
              }`}
            >
              <span className="text-xl">💳</span>
              <div className="text-left">
                <h4 className="text-xs font-bold text-white">Pago en Línea</h4>
                <p className="text-[10px] text-accent/80 leading-tight font-medium">
                  Prepago con MercadoPago.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-surface border border-surface/50 flex flex-col gap-2">
          <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider border-b border-surface/50 pb-1.5">
            Resumen de Cita
          </h4>
          <div className="flex justify-between text-xs">
            <span className="text-secondary">Servicio:</span>
            <span className="font-bold text-white">{selectedService.name}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-secondary">Barbero:</span>
            <span className="font-bold text-white">{selectedBarber.name}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-secondary">Fecha:</span>
            <span className="font-bold text-white">{selectedDate}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-secondary">Hora:</span>
            <span className="font-bold text-white">{selectedSlot} hs</span>
          </div>
          <div className="flex justify-between text-xs border-t border-surface/50 pt-2 mt-1">
            <span className="font-bold text-white">Total a pagar:</span>
            <span className="font-bold text-accent font-serif text-sm">
              S/ {Number(selectedService.price).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {showOnlineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onCloseOnlineModal}
          />
          <div className="relative max-w-sm w-full bg-surface/90 border border-surface/60 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-2">
              Pago en Línea - Próximamente
            </h3>
            <p className="text-xs text-secondary mb-4">
              Estamos trabajando para habilitar pagos en línea (MercadoPago).
              Por ahora solo está disponible el pago en la barbería.
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onCloseOnlineModal}
                className="px-4 py-2 rounded-lg bg-accent text-surface font-bold hover:bg-accent/90 transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <Button
          nClass="w-full mt-6 py-3.5"
          text="Atrás"
          onClick={onPrev}
          disabled={loading}
        />
        <Button
          nClass="w-full mt-6 py-3.5"
          text={
            loading ? (
              <>
                <div className="w-4 h-4 border-2 border-surface border-t-transparent rounded-full animate-spin" />
                <span>Procesando...</span>
              </>
            ) : (
              <span>Confirmar</span>
            )
          }
          disabled={loading}
          variant="filleable"
          type="submit"
        />
      </div>
    </form>
  );
}
