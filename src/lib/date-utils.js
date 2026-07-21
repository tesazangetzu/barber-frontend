export function formatoHoraCita(isoString) {
  if (!isoString) return '-';
  const m = isoString.match(/T(\d{2}:\d{2})/);
  if (m) return m[1];
  try {
    return new Date(isoString).toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Lima",
    });
  } catch {
    return isoString.substring(11, 16);
  }
}

export function formatoFechaCita(isoString) {
  if (!isoString) return '-';
  const [datePart] = isoString.split('T');
  return datePart;
}

export function agregarOffsetLima(fecha, hora) {
  return `${fecha}T${hora}:00-05:00`;
}
