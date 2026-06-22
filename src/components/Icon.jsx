import "@iconify/iconify";

export default function Icon({ name, className = "" }) {
  return (
    <iconify-icon
      icon={name}
      class={`animate-swing icon-swing text-accent ${className}`}
    ></iconify-icon>
  );
}
