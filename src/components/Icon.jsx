import "@iconify/iconify";

export default function Icon({ name, className = "" }) {
  return (
    <iconify-icon
      icon={name}
      aria-hidden="true"
      class={`animate-swing icon-swing text-accent -mb-0.5 ${className}`}
    ></iconify-icon>
  );
}
