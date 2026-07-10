import { useState, useEffect, useCallback, useRef } from "react";

const API_BASE = import.meta.env.PUBLIC_API_BASE;

export function useAvailability(selectedBarber, selectedDate, selectedService) {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState("");
  const abortRef = useRef(null);

  const fetchSlots = useCallback(async () => {
    if (!selectedBarber || !selectedDate) {
      setAvailableSlots([]);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setSlotsLoading(true);
    setSlotsError("");

    try {
      const params = new URLSearchParams({
        barberId: selectedBarber.id,
        date: selectedDate,
      });
      if (selectedService?.id) {
        params.append('serviceId', selectedService.id);
      }

      const res = await fetch(
        `${API_BASE}/appointments/available?${params.toString()}`,
        { signal: controller.signal },
      );

      if (!res.ok) {
        setAvailableSlots([]);
        return;
      }

      const data = await res.json();
      setAvailableSlots(data);
    } catch (err) {
      if (err.name !== "AbortError") {
        setSlotsError("No se pudieron cargar los horarios disponibles.");
        setAvailableSlots([]);
      }
    } finally {
      if (!controller.signal.aborted) setSlotsLoading(false);
    }
  }, [selectedBarber, selectedDate, selectedService]);

  useEffect(() => {
    fetchSlots();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchSlots]);

  return { availableSlots, slotsLoading, slotsError };
}
