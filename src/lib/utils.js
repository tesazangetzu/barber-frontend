// Format date to readable string
export function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Format time
export function formatTime(timeString) {
  if (!timeString) return "-";
  return timeString.substring(0, 5);
}

// Format currency
export function formatCurrency(value) {
  if (typeof value !== "number") value = parseFloat(value);
  return `S/${value.toFixed(2)}`;
}

// Days of week mapping
export const daysOfWeek = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
];

export function getDayOfWeekName(dayNumber) {
  return daysOfWeek.find((d) => d.value === dayNumber)?.label || "-";
}

// Generate mock chart data (in production, this would come from your API)
export function generateChartData(days = 7) {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const name = date.toLocaleDateString("es-ES", {
      month: "short",
      day: "numeric",
    });

    data.push({
      name,
      count: Math.floor(Math.random() * 15) + 1,
      revenue: Math.floor(Math.random() * 500) + 50,
    });
  }
  return data;
}

// Validate email
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate phone
export function validatePhone(phone) {
  return /^\+?[0-9]{9,15}$/.test(phone.replace(/\D/g, ""));
}
