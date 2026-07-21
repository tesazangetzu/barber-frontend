import Button from "../../Button";

function BarberSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-surface/40 bg-surface/30 animate-pulse">
      <div className="w-12 h-12 rounded-full bg-surface/60 shrink-0" />
      <div className="space-y-2 grow">
        <div className="h-4 w-28 bg-surface/60 rounded" />
        <div className="h-3 w-20 bg-surface/60 rounded" />
      </div>
    </div>
  );
}

export function SelectBarber({
  barbers,
  barbersLoading,
  barbersError,
  selectedBarber,
  onSelect,
  onPrev,
  onNext,
}) {
  return (
    <div>
      <h2 className="text-lg font-serif font-bold text-white mb-1">
        Elige un Barbero
      </h2>
      <p className="text-xs text-secondary mb-4">
        Selecciona a tu profesional favorito.
      </p>

      {barbersError && (
        <p className="text-xs text-error mb-4">
          Error al cargar barberos. Intentalo de nuevo.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {barbersLoading
          ? Array.from({ length: 3 }).map((_, i) => <BarberSkeleton key={i} />)
          : barbers.map((barber) => (
              <div
                key={barber.id}
                onClick={() => onSelect(barber)}
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
        <Button nClass="w-full mt-6 py-3.5" text="Atrás" onClick={onPrev} />
          <Button
            nClass="w-full mt-6 py-3.5"
            text="Continuar"
            disabled={!selectedBarber}
            onClick={onNext}
            variant="primary"
          />
      </div>
    </div>
  );
}
