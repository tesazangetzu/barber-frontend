import React, { useState, useEffect, useRef } from "react";

const API_BASE = import.meta.env.PUBLIC_API_BASE;

export default function BookingWizard() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);

  // Selection State
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  // Availability slots
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Customer Form
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("LOCAL"); // LOCAL or ONLINE
  const [showOnlineModal, setShowOnlineModal] = useState(false);
  const continueBtnRef = useRef(null);

  const highlightAndScroll = () => {
    if (!continueBtnRef.current) return;
    try {
      continueBtnRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      // Small attention animation using Web Animations API
      if (continueBtnRef.current.animate) {
        continueBtnRef.current.animate(
          [
            { transform: "translateY(0)", offset: 0 },
            { transform: "translateY(-6px)", offset: 0.5 },
            { transform: "translateY(0)", offset: 1 },
          ],
          { duration: 420, easing: "cubic-bezier(.2,.8,.2,1)" },
        );
      }
    } catch (e) {
      // ignore if animation fails
      console.warn("scroll highlight failed", e);
    }
  };

  // Status and Error states
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      try {
        const [servicesRes, barbersRes] = await Promise.all([
          fetch(`${API_BASE}/services`),
          fetch(`${API_BASE}/barbers`),
        ]);

        if (!servicesRes.ok || !barbersRes.ok) {
          throw new Error(
            "No se pudo cargar los datos iniciales del servidor.",
          );
        }

        setServices(await servicesRes.json());
        setBarbers(await barbersRes.json());
      } catch (e) {
        console.warn("Error al obtener datos iniciales del backend.", e);
        setErrorMsg(
          "No se pudieron cargar los servicios y barberos desde el servidor.",
        );
      }
    }
    fetchData();
  }, []);

  // Fetch available slots when barber or date changes
  useEffect(() => {
    if (!selectedBarber || !selectedDate) return;

    async function fetchSlots() {
      setSlotsLoading(true);
      setErrorMsg("");
      try {
        const res = await fetch(
          `${API_BASE}/appointments/available?barberId=${selectedBarber.id}&date=${selectedDate}`,
        );
        if (res.ok) {
          const data = await res.json();
          setAvailableSlots(data);
        } else {
          setAvailableSlots([]);
        }
      } catch (e) {
        console.warn(
          "Error al obtener los horarios disponibles desde el backend.",
          e,
        );
        setErrorMsg("No se pudieron cargar los horarios disponibles.");
        setAvailableSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    }
    fetchSlots();
  }, [selectedBarber, selectedDate]);

  // Helper: Check if a slot is in the past (only for today)
  const isSlotInThePast = (slot, date) => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    // Only validate if it's today
    if (date !== todayStr) return false;

    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    const [slotHour, slotMinute] = slot.split(":").map(Number);
    const slotTime = slotHour * 60 + slotMinute;

    return slotTime <= currentTime;
  };

  // Helper: Get next 7 days for booking
  const getNext7Days = () => {
    const days = [];
    const weekdays = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const date = String(d.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${date}`;

      // Skip Sundays (barbería closed)
      if (d.getDay() === 0) continue;

      days.push({
        dateStr,
        dayNum: d.getDate(),
        dayName: weekdays[d.getDay()],
      });
    }
    return days;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !clientEmail) {
      setErrorMsg("Por favor completa todos los campos.");
      return;
    }

    // Validate that the selected slot is not in the past
    if (isSlotInThePast(selectedSlot, selectedDate)) {
      setErrorMsg("No puedes agendar citas en horarios que ya han pasado.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    // Construct ISO start time (wall-clock in America/Lima timezone)
    const isoStartTime = `${selectedDate}T${selectedSlot}:00`;

    const appointmentPayload = {
      barber_id: selectedBarber.id,
      service_id: selectedService.id,
      client_name: clientName,
      client_phone: clientPhone,
      client_email: clientEmail,
      start_time: isoStartTime,
    };

    try {
      // 1. Create appointment
      const response = await fetch(`${API_BASE}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentPayload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Error al agendar cita.");
      }

      const appointment = await response.json();

      // 2. Checkout flow
      if (paymentMethod === "ONLINE") {
        const payRes = await fetch(
          `${API_BASE}/payments/checkout/${appointment.id}`,
          {
            method: "POST",
          },
        );
        if (payRes.ok) {
          const { init_point } = await payRes.json();
          window.location.href = init_point; // Redirect to MercadoPago checkout!
          return;
        } else {
          setErrorMsg(
            "Cita agendada, pero falló la creación del link de pago. Podrás pagar en la barbería.",
          );
          setSuccessData(appointment);
          setStep(5);
        }
      } else {
        setSuccessData(appointment);
        setStep(5);
      }
    } catch (err) {
      console.warn("Error al registrar la cita en el backend.", err);
      setErrorMsg(err.message || "Error al agendar cita.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Progress Indicators */}
      <div className="flex items-center justify-between mb-6 px-1">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center grow last:grow-0">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                step >= s
                  ? "bg-accent text-surface border-accent shadow-md shadow-accent/10"
                  : "bg-surface text-secondary border-surface border"
              }`}
            >
              {s}
            </div>
            {s < 4 && (
              <div
                className={`h-0.5 grow mx-2 rounded-full transition-colors ${
                  step > s ? "bg-accent" : "bg-surface"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {errorMsg && (
        <div className="mb-4 p-3.5 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-semibold">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Step 1: Select Service */}
      {step === 1 && (
        <div className="animate-fadeIn">
          <h2 className="text-lg font-serif font-bold text-white mb-1">
            Selecciona un Servicio
          </h2>
          <p className="text-xs text-secondary mb-4">
            Elige el servicio que deseas agendar el día de hoy.
          </p>
          <div className="flex flex-col gap-3">
            {services.map((service) => (
              <div
                key={service.id}
                onClick={() => {
                  setSelectedService(service);
                  highlightAndScroll();
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center gap-4 ${
                  selectedService?.id === service.id
                    ? "bg-accent/10 border-accent"
                    : "bg-surface/30 border-surface/40 hover:border-surface/60"
                }`}
              >
                <div className="grow">
                  <h3 className="font-bold text-white text-sm mb-1">
                    {service.name}
                  </h3>
                  <p className="text-secondary text-xs line-clamp-2 leading-relaxed mb-2">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center text-[10px] text-secondary bg-surface px-2 py-0.5 rounded">
                    🕒 {service.duration_minutes} min
                  </span>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-accent font-bold font-serif text-lg">
                    S/ {Number(service.price).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button
            ref={continueBtnRef}
            disabled={!selectedService}
            onClick={() => setStep(2)}
            className="w-full mt-6 py-3.5 rounded-xl bg-accent text-surface font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent/90 transition-colors"
          >
            Continuar
          </button>
        </div>
      )}

      {/* Step 2: Select Barber */}
      {step === 2 && (
        <div className="animate-fadeIn">
          <h2 className="text-lg font-serif font-bold text-white mb-1">
            Elige un Barbero
          </h2>
          <p className="text-xs text-secondary mb-4">
            Selecciona a tu profesional favorito.
          </p>
          <div className="flex flex-col gap-3">
            {barbers.map((barber) => (
              <div
                key={barber.id}
                onClick={() => {
                  setSelectedBarber(barber);
                  highlightAndScroll();
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-4 ${
                  selectedBarber?.id === barber.id
                    ? "bg-accent/10 border-accent"
                    : "bg-surface/30 border-surface/40 hover:border-surface/60"
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent flex items-center justify-center text-2xl shrink-0">
                  {barber.avatar || "💈"}
                </div>
                <div className="grow">
                  <h3 className="font-bold text-white text-sm">
                    {barber.name}
                  </h3>
                  <span className="text-[10px] text-accent font-medium uppercase">
                    Barbero Profesional
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3.5 rounded-xl border border-surface hover:bg-surface text-secondary font-bold transition-colors"
            >
              Atrás
            </button>
            <button
              ref={continueBtnRef}
              disabled={!selectedBarber}
              onClick={() => setStep(3)}
              className="flex-1 py-3.5 rounded-xl bg-accent text-surface font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent/90 transition-colors"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Date & Time selection */}
      {step === 3 && (
        <div className="animate-fadeIn">
          <h2 className="text-lg font-serif font-bold text-white mb-1">
            Fecha & Hora
          </h2>
          <p className="text-xs text-secondary mb-4">
            Selecciona el día y horario libre que prefieras.
          </p>

          {/* Days Calendar */}
          <div className="grid grid-cols-6 gap-2 mb-6">
            {getNext7Days().map((day) => (
              <div
                key={day.dateStr}
                onClick={() => {
                  setSelectedDate(day.dateStr);
                  setSelectedSlot("");
                  highlightAndScroll();
                }}
                className={`py-3 rounded-lg border text-center cursor-pointer transition-all flex flex-col justify-center gap-0.5 ${
                  selectedDate === day.dateStr
                    ? "bg-accent border-accent text-surface shadow-md shadow-accent/10"
                    : "bg-surface/30 border-surface/40 text-secondary hover:border-surface/60"
                }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  {day.dayName}
                </span>
                <span className="text-lg font-serif font-bold leading-tight">
                  {day.dayNum}
                </span>
              </div>
            ))}
          </div>

          {/* Slots Availability list */}
          {selectedDate ? (
            <div>
              <h3 className="text-xs font-semibold uppercase text-secondary tracking-wider mb-3">
                Horarios Disponibles
              </h3>
              {slotsLoading ? (
                <div className="py-8 text-center text-xs text-secondary animate-pulse">
                  Cargando horarios libres...
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot) => {
                    const isInThePast = isSlotInThePast(slot, selectedDate);
                    return (
                      <div
                        key={slot}
                        onClick={() => {
                          if (isInThePast) {
                            setErrorMsg(
                              "No puedes agendar citas en horarios que ya han pasado. Selecciona una hora posterior a la actual.",
                            );
                            setSelectedSlot("");
                          } else {
                            setErrorMsg("");
                            setSelectedSlot(slot);
                            // after picking a slot, guide user to confirm
                            highlightAndScroll();
                          }
                        }}
                        className={`py-2.5 rounded-lg border text-center text-xs font-bold cursor-pointer transition-all ${
                          isInThePast
                            ? "opacity-40 cursor-not-allowed bg-surface/20 border-error/30 text-secondary"
                            : selectedSlot === slot
                              ? "bg-accent/20 border-accent text-accent"
                              : "bg-surface/30 border-surface/40 text-white hover:border-surface/60"
                        }`}
                        title={isInThePast ? "Este horario ya ha pasado" : ""}
                      >
                        {slot}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-secondary bg-surface/20 border border-surface/40 rounded-xl">
                  📭 Sin horarios disponibles para este día. Elige otra fecha.
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-secondary bg-surface/10 border border-surface/20 rounded-xl">
              📅 Selecciona un día arriba para ver las horas disponibles.
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-3.5 rounded-xl border border-surface hover:bg-surface text-secondary font-bold transition-colors"
            >
              Atrás
            </button>
            <button
              ref={continueBtnRef}
              disabled={!selectedDate || !selectedSlot}
              onClick={() => setStep(4)}
              className="flex-1 py-3.5 rounded-xl bg-accent text-surface font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent/90 transition-colors"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Checkout and Client details */}
      {step === 4 && (
        <form onSubmit={handleBookingSubmit} className="animate-fadeIn">
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
                onChange={(e) => setClientName(e.target.value)}
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
                onChange={(e) => setClientPhone(e.target.value)}
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
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="Ej. juan@correo.com"
                className="w-full px-4 py-3 rounded-xl bg-surface/30 border border-surface focus:border-accent focus:ring-1 focus:ring-accent text-sm text-primary placeholder:text-secondary outline-none transition-all"
              />
            </div>

            {/* Payment Method Selector */}
            <div className="mt-2 border-t border-surface/50 pt-4">
              <label className="block text-[11px] font-semibold text-secondary uppercase tracking-wider mb-2">
                Método de Pago
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setPaymentMethod("LOCAL")}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col gap-1.5 ${
                    paymentMethod === "LOCAL"
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
                  onClick={() => {
                    // Do not allow ONLINE yet; show modal informing user
                    setShowOnlineModal(true);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col gap-1.5 ${
                    paymentMethod === "ONLINE"
                      ? "bg-accent/10 border-accent"
                      : "bg-surface/30 border-surface/40 hover:border-surface/60"
                  }`}
                >
                  <span className="text-xl">💳</span>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-white">
                      Pago en Línea
                    </h4>
                    <p className="text-[10px] text-accent/80 leading-tight font-medium">
                      Prepago con MercadoPago.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Ticket */}
            <div className="mt-4 p-4 rounded-xl bg-surface border border-surface/50 flex flex-col gap-2">
              <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider border-b border-surface/50 pb-1.5">
                Resumen de Cita
              </h4>
              <div className="flex justify-between text-xs">
                <span className="text-secondary">Servicio:</span>
                <span className="font-bold text-white">
                  {selectedService.name}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-secondary">Barbero:</span>
                <span className="font-bold text-white">
                  {selectedBarber.name}
                </span>
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
                  ${Number(selectedService.price).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          {/* Modal: Pago en línea próximamente */}
          {showOnlineModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setShowOnlineModal(false)}
              />
              <div className="relative max-w-sm w-full bg-surface/90 border border-surface/60 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-2">
                  Pago en Línea - Próximamente
                </h3>
                <p className="text-xs text-secondary mb-4">
                  Estamos trabajando para habilitar pagos en línea
                  (MercadoPago). Por ahora solo está disponible el pago en la
                  barbería.
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowOnlineModal(false)}
                    className="px-4 py-2 rounded-lg bg-accent text-surface font-bold hover:bg-accent/90 transition-colors"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              disabled={loading}
              onClick={() => setStep(3)}
              className="flex-1 py-3.5 rounded-xl border border-surface hover:bg-surface text-secondary font-bold transition-colors disabled:opacity-40"
            >
              Atrás
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3.5 rounded-xl bg-accent text-surface font-bold hover:bg-accent/90 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-surface border-t-transparent rounded-full animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <span>Confirmar Cita</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Step 5: Success Ticket Page */}
      {step === 5 && successData && (
        <div className="animate-fadeIn text-center py-6">
          <div className="w-16 h-16 rounded-full bg-success/10 border border-success flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">
            🎉
          </div>
          <h2 className="text-xl font-serif font-bold text-white mb-1">
            ¡Cita Confirmada!
          </h2>
          <p className="text-xs text-secondary max-w-xs mx-auto mb-6">
            Tu cita ha sido agendada con éxito. Te esperamos en la barbería en
            tu horario programado.
          </p>

          {/* Ticket styling */}
          <div className="max-w-xs mx-auto bg-surface/40 border border-surface p-5 rounded-2xl text-left shadow-xl relative overflow-hidden">
            {/* Decors */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-accent/80 via-accent to-accent/80" />

            <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider block mb-3">
              Recibo de Cita #{successData.id}
            </span>
            <div className="flex flex-col gap-2.5">
              <div>
                <span className="text-[9px] text-secondary uppercase block">
                  Cliente
                </span>
                <span className="text-xs font-bold text-white">
                  {successData.client_name}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[9px] text-secondary uppercase block">
                    Barbero
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {successData.barber.name}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-secondary uppercase block">
                    Servicio
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {successData.service.name}
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
                  ${Number(successData.service.price).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <a
            href="/"
            className="inline-block mt-8 text-xs font-bold text-surface bg-accent px-8 py-3 rounded-xl hover:bg-accent/90 transition-colors"
          >
            Volver al Inicio
          </a>
        </div>
      )}
    </div>
  );
}
