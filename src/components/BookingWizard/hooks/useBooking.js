import { useState, useCallback } from "react";
import { agregarOffsetLima } from "../../../lib/date-utils";

const API_BASE = import.meta.env.PUBLIC_API_BASE;
const STEPS = ["service", "barber", "date", "payment", "success"];
const PAYMENT_METHOD = { LOCAL: "LOCAL", ONLINE: "ONLINE" };

export function useBooking() {
  const [step, setStepRaw] = useState("service");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [appointment, setAppointment] = useState(null);
  const [showOnlineModal, setShowOnlineModal] = useState(false);

  const [selectedService, setSelectedService] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHOD.LOCAL);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const highlightAndScroll = useCallback(() => {
    try {
      const el = document.getElementById("booking-wizard");
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "end" });
    } catch {
      // ignore
    }
  }, []);

  const setStep = useCallback((newStep) => {
    if (STEPS.includes(newStep)) {
      setStepRaw(newStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const nextStep = useCallback(() => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  }, [step, setStep]);

  const prevStep = useCallback(() => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  }, [step, setStep]);

  const canProceed = (() => {
    switch (step) {
      case "service":
        return !!selectedService;
      case "barber":
        return !!selectedBarber;
      case "date":
        return !!selectedDate && !!selectedSlot;
      case "payment":
        return !!clientName && !!clientPhone && !!clientEmail;
      default:
        return false;
    }
  })();

  const handleBarberChange = useCallback(
    (barber) => {
      setSelectedBarber(barber);
      setSelectedDate("");
      setSelectedSlot("");
      highlightAndScroll();
    },
    [highlightAndScroll],
  );

  const handleDateChange = useCallback(
    (date) => {
      setSelectedDate(date);
      setSelectedSlot("");
      highlightAndScroll();
    },
    [highlightAndScroll],
  );

  const handleSlotChange = useCallback(
    (slot) => {
      setSelectedSlot(slot);
      setError("");
      highlightAndScroll();
    },
    [highlightAndScroll],
  );

  const handlePaymentMethodChange = useCallback((method) => {
    if (method === PAYMENT_METHOD.ONLINE) {
      setShowOnlineModal(true);
    } else {
      setPaymentMethod(method);
    }
  }, []);

  const handleCloseOnlineModal = useCallback(() => {
    setShowOnlineModal(false);
    setPaymentMethod(PAYMENT_METHOD.LOCAL);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (submitting) return;
      if (!clientName || !clientPhone || !clientEmail) {
        setError("Por favor completa todos los campos.");
        return;
      }

      setSubmitting(true);
      setLoading(true);
      setError("");

      const isoStartTime = agregarOffsetLima(selectedDate, selectedSlot);

      const appointmentPayload = {
        barber_id: selectedBarber.id,
        service_id: selectedService.id,
        client_name: clientName,
        client_phone: clientPhone,
        client_email: clientEmail,
        start_time: isoStartTime,
      };

      try {
        const res = await fetch(`${API_BASE}/appointments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(appointmentPayload),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Error al agendar cita.");
        }

        const appointmentData = await res.json();

        if (paymentMethod === PAYMENT_METHOD.ONLINE) {
          const payRes = await fetch(
            `${API_BASE}/payments/checkout/${appointmentData.id}`,
            { method: "POST" },
          );
          if (payRes.ok) {
            const { init_point } = await payRes.json();
            window.location.href = init_point;
            return;
          } else {
            setError(
              "Cita agendada, pero falló la creación del link de pago. Podrás pagar en la barbería.",
            );
            setAppointment(appointmentData);
            setStep("success");
          }
        } else {
          setAppointment(appointmentData);
          setStep("success");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
    [
      submitting,
      selectedBarber,
      selectedService,
      clientName,
      clientPhone,
      clientEmail,
      selectedDate,
      selectedSlot,
      paymentMethod,
      setStep,
    ],
  );

  return {
    step,
    setStep,
    nextStep,
    prevStep,
    loading,
    error,
    setError,
    canProceed,
    appointment,
    highlightAndScroll,
    showOnlineModal,
    selectedService,
    setSelectedService,
    selectedBarber,
    setSelectedBarber: handleBarberChange,
    selectedDate,
    setSelectedDate: handleDateChange,
    selectedSlot,
    setSelectedSlot: handleSlotChange,
    paymentMethod,
    setPaymentMethod: handlePaymentMethodChange,
    clientName,
    setClientName,
    clientPhone,
    setClientPhone,
    clientEmail,
    setClientEmail,
    submitting,
    handleSubmit,
    PAYMENT_METHOD,
    handleCloseOnlineModal,
  };
}
