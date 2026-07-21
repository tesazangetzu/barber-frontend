import Button from "../../Button";
import Icon from "../../Icon";

function ServiceCard({ service, selected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center gap-4 ${
        selected
          ? "bg-accent/10 border-accent"
          : "bg-surface/30 border-surface/40 hover:border-surface/60"
      }`}
    >
      <div className="grow">
        <h3 className="font-bold text-white text-sm mb-1">{service.name}</h3>
        <p className="text-secondary text-xs line-clamp-2 leading-relaxed mb-2">
          {service.description}
        </p>
        <span className="inline-flex items-center text-[10px] text-secondary bg-surface px-2 py-0.5 rounded">
          <Icon name="prime:clock" className="mr-1" />{" "}
          {service.duration_minutes} min
        </span>
      </div>
      <div className="shrink-0 text-right">
        <span className="text-accent font-bold font-serif text-lg">
          S/ {Number(service.price).toFixed(2)}
        </span>
      </div>
    </div>
  );
}

function ServiceSkeleton() {
  return (
    <div className="p-4 rounded-xl border border-surface/40 bg-surface/30 animate-pulse">
      <div className="space-y-2 mb-3">
        <div className="h-4 w-32 bg-surface/60 rounded" />
        <div className="h-3 w-48 bg-surface/60 rounded" />
      </div>
      <div className="h-5 w-16 bg-surface/60 rounded" />
    </div>
  );
}

export function SelectService({
  services,
  servicesLoading,
  servicesError,
  selectedService,
  onSelect,
  onNext,
}) {
  return (
    <div>
      <h2 className="text-lg font-serif font-bold text-white mb-1">
        Selecciona un Servicio
      </h2>
      <p className="text-xs text-secondary mb-4">
        Elige el servicio que deseas agendar el día de hoy.
      </p>

      {servicesError && (
        <p className="text-xs text-error mb-4">
          Error al cargar servicios. Intentalo de nuevo.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {servicesLoading
          ? Array.from({ length: 4 }).map((_, i) => <ServiceSkeleton key={i} />)
          : services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                selected={selectedService?.id === service.id}
                onSelect={() => onSelect(service)}
              />
            ))}
      </div>
      <Button
        nClass="w-full mt-6 py-3.5"
        text="Continuar"
        disabled={!selectedService}
        onClick={onNext}
        variant="primary"
      />
    </div>
  );
}
