export default function CustomLink({ href, text, className = "" }) {
  return (
    <a
      href={href}
      className={`group relative overflow-hidden ${className ?? "px-12 py-5"}`}
    >
      <div className="absolute inset-0 border border-(--byzantine-gold)/60 transition-all group-hover:border-(--byzantine-gold) group-hover:scale-95"></div>
      <div className="absolute inset-0 bg-(--byzantine-gold) translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
      <span className="relative z-10 text-[10px] tracking-[0.4em] uppercase font-bold text-(--byzantine-gold) group-hover:text-(--midnight-navy) transition-colors duration-500">
        {text}
      </span>
    </a>
  );
}
