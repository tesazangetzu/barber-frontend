import Button from "../../Button";
import Icon from "../../Icon";

function splitSlots(slots) {
  const morning = [];
  const afternoon = [];

  slots.forEach((slot) => {
    const hour = Number(slot.split(":")[0]);

    if (hour < 12) {
      morning.push(slot);
    } else {
      afternoon.push(slot);
    }
  });

  return { morning, afternoon };
}

const EXCLUDED_DAYS = [0]; // 0 = Domingo

function getNext7Days() {
  const days = [];
  const weekdays = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
  const fmtDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const fmtDow = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Lima",
    weekday: "short",
  });
  const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);

    const dateStr = fmtDate.format(d);
    const dowIdx = dayMap[fmtDow.format(d)];
    if (EXCLUDED_DAYS.includes(dowIdx)) continue;

    days.push({
      dateStr,
      dayNum: parseInt(dateStr.slice(8, 10), 10),
      dayName: weekdays[dowIdx],
    });
  }

  return days;
}

function isSlotPast(selectedDate, slotTime) {
  const now = new Date();
  const limaParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const getPart = (type) => limaParts.find((p) => p.type === type)?.value;

  const todayStr = `${getPart("year")}-${getPart("month")}-${getPart("day")}`;
  if (selectedDate !== todayStr) return false;

  const currentMinutes =
    parseInt(getPart("hour"), 10) * 60 + parseInt(getPart("minute"), 10);
  const [sh, sm] = slotTime.split(":").map(Number);
  const slotMinutes = sh * 60 + sm;

  return slotMinutes <= currentMinutes;
}

export function SelectDate({
  selectedDate,
  selectedSlot,
  availableSlots,
  slotsLoading,
  onSelectDate,
  onSelectSlot,
  onPrev,
  onNext,
}) {
  const days = getNext7Days();

  const { morning, afternoon } = splitSlots(availableSlots || []);

  return (
    <div>
      <h2 className="text-lg font-serif font-bold text-white mb-1">
        Fecha & Hora
      </h2>

      <p className="text-xs text-secondary mb-4">
        Selecciona el día y horario libre que prefieras.
      </p>

      {/* DAYS */}
      <div className="grid grid-cols-6 gap-2 mb-6">
        {days.map((day) => (
          <div
            key={day.dateStr}
            onClick={() => onSelectDate(day.dateStr)}
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

      {/* SLOTS */}
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
            <div className="space-y-5">
              {/* 🌅 MORNING */}
              {morning.length > 0 && (
                <div>
                  <h4 className="inline-block text-base text-secondary font-bold mb-2">
                    <Icon name="mynaui:sun" className="text-xl" /> Mañana
                  </h4>

                  <div className="grid grid-cols-3 gap-2">
                    {morning.map((slot) => {
                      const past = isSlotPast(selectedDate, slot);
                      return (
                        <div
                          key={slot}
                          onClick={() => !past && onSelectSlot(slot)}
                          className={`py-2.5 rounded-lg border text-center text-xs font-bold transition-all ${
                            past
                              ? "bg-surface/10 border-surface/20 text-secondary/40 cursor-not-allowed"
                              : selectedSlot === slot
                                ? "bg-accent/20 border-accent text-accent cursor-pointer"
                                : "bg-surface/30 border-surface/40 text-white hover:border-surface/60 cursor-pointer"
                          }`}
                        >
                          {slot}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 🌇 AFTERNOON */}
              {afternoon.length > 0 && (
                <div>
                  <h4 className="inline-block text-base text-secondary font-bold mb-2">
                    <Icon name="mynaui:moon" className="text-xl" /> Tarde
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {afternoon.map((slot) => {
                      const past = isSlotPast(selectedDate, slot);
                      return (
                        <div
                          key={slot}
                          onClick={() => !past && onSelectSlot(slot)}
                          className={`py-2.5 rounded-lg border text-center text-xs font-bold transition-all ${
                            past
                              ? "bg-surface/10 border-surface/20 text-secondary/40 cursor-not-allowed"
                              : selectedSlot === slot
                                ? "bg-accent/20 border-accent text-accent cursor-pointer"
                                : "bg-surface/30 border-surface/40 text-white hover:border-surface/60 cursor-pointer"
                          }`}
                        >
                          {slot}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
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

      {/* NAV */}
      <div className="flex gap-3 mt-6">
        <Button nClass="w-full mt-6 py-3.5" text="Atrás" onClick={onPrev} />

        <Button
          nClass="w-full mt-6 py-3.5"
          text="Continuar"
          disabled={!selectedDate || !selectedSlot}
          onClick={onNext}
          variant="primary"
        />
      </div>
    </div>
  );
}
