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

function getNext7Days() {
  const days = [];
  const weekdays = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);

    if (d.getDay() === 0) continue;

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const date = String(d.getDate()).padStart(2, "0");

    const dateStr = `${year}-${month}-${date}`;

    days.push({
      dateStr,
      dayNum: d.getDate(),
      dayName: weekdays[d.getDay()],
    });
  }

  return days;
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
                    {morning.map((slot) => (
                      <div
                        key={slot}
                        onClick={() => onSelectSlot(slot)}
                        className={`py-2.5 rounded-lg border text-center text-xs font-bold cursor-pointer transition-all ${
                          selectedSlot === slot
                            ? "bg-accent/20 border-accent text-accent"
                            : "bg-surface/30 border-surface/40 text-white hover:border-surface/60"
                        }`}
                      >
                        {slot}
                      </div>
                    ))}
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
                    {afternoon.map((slot) => (
                      <div
                        key={slot}
                        onClick={() => onSelectSlot(slot)}
                        className={`py-2.5 rounded-lg border text-center text-xs font-bold cursor-pointer transition-all ${
                          selectedSlot === slot
                            ? "bg-accent/20 border-accent text-accent"
                            : "bg-surface/30 border-surface/40 text-white hover:border-surface/60"
                        }`}
                      >
                        {slot}
                      </div>
                    ))}
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
          variant="filleable"
        />
      </div>
    </div>
  );
}
