import CustomLink from "../../CustomLink";

export function Success({
  appointment,
  selectedDate,
  selectedSlot,
  paymentMethod,
}) {
  return (
    <div className="text-center py-6">
      <div className="w-16 h-16 rounded-full bg-success/10 border border-success flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">
        🎉
      </div>
      <h2 className="text-xl font-serif font-bold text-white mb-1">
        ¡Cita Confirmada!
      </h2>
      <p className="text-xs text-secondary max-w-xs mx-auto mb-6">
        Tu cita ha sido agendada con éxito. Te esperamos en la barbería en tu
        horario programado.
      </p>

      <div className="max-w-xs mx-auto bg-surface/40 border border-surface p-5 rounded-2xl text-left shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-accent/80 via-accent to-accent/80" />

        <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider block mb-3">
          Recibo de Cita #{appointment.id}
        </span>
        <div className="flex flex-col gap-2.5">
          <div>
            <span className="text-[9px] text-secondary uppercase block">
              Cliente
            </span>
            <span className="text-xs font-bold text-white">
              {appointment.client_name}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[9px] text-secondary uppercase block">
                Barbero
              </span>
              <span className="text-xs font-semibold text-white">
                {appointment.barber?.name}
              </span>
            </div>
            <div>
              <span className="text-[9px] text-secondary uppercase block">
                Servicio
              </span>
              <span className="text-xs font-semibold text-white">
                {appointment.service?.name}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[9px] text-secondary uppercase block">
                Día
              </span>
              <span className="text-xs font-semibold text-white">
                {selectedDate}
              </span>
            </div>
            <div>
              <span className="text-[9px] text-secondary uppercase block">
                Horario
              </span>
              <span className="text-xs font-semibold text-white">
                {selectedSlot} hs
              </span>
            </div>
          </div>
          <div className="border-t border-surface/60 pt-3 mt-1 flex justify-between items-center">
            <div>
              <span className="text-[9px] text-secondary uppercase block">
                Total a Pagar
              </span>
              <span className="text-xs font-semibold text-secondary">
                {paymentMethod === "LOCAL"
                  ? "Pago en Barbería"
                  : "Pagado Online"}
              </span>
            </div>
            <span className="text-accent font-bold font-serif text-lg">
              $ {Number(appointment.service?.price).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <CustomLink
        href="/"
        text="Volver al Inicio"
        className="inline-block mt-8 text-xs font-bold px-8 py-4"
      />
    </div>
  );
}
