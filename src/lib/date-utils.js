const LIMA_OFFSET = '-05:00';

export function formatoHoraCita(isoString) {
  if (!isoString) return '-';
  return isoString.substring(11, 16);
}

export function formatoFechaCita(isoString) {
  if (!isoString) return '-';
  const [datePart] = isoString.split('T');
  return datePart;
}

export function agregarOffsetLima(fecha, hora) {
  return `${fecha}T${hora}:00${LIMA_OFFSET}`;
}
