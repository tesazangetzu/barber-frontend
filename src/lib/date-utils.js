export function formatoHoraCita(isoString) {
  if (!isoString) return '-';
  const m = isoString.match(/T(\d{2}:\d{2})/);
  return m ? m[1] : isoString.substring(11, 16);
}

export function formatoFechaCita(isoString) {
  if (!isoString) return '-';
  const [datePart] = isoString.split('T');
  return datePart;
}

export function agregarOffsetLima(fecha, hora) {
  return `${fecha}T${hora}:00-05:00`;
}
