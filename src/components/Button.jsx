import { forwardRef } from "react";

const Button = forwardRef(
  (
    {
      text,
      nClass,
      variant = "outline",
      disabled = false,
      onClick,
      id,
      ...rest
    },
    ref,
  ) => {
    const isOutline = variant === "outline";
    const disabledClasses = disabled
      ? "opacity-40 cursor-not-allowed pointer-events-none"
      : "";
    const baseClasses = "group relative overflow-hidden";
    const fillSlide = disabled
      ? "translate-y-full"
      : isOutline
        ? "translate-y-full group-hover:translate-y-0"
        : "translate-y-0 group-hover:translate-y-full";
    const textColors = disabled
      ? isOutline
        ? "text-(--byzantine-gold)"
        : "text-(--midnight-navy)"
      : isOutline
        ? "text-(--byzantine-gold) group-hover:text-(--midnight-navy)"
        : "text-(--midnight-navy) group-hover:text-(--byzantine-gold)";

    return (
      <button
        className={`${baseClasses} ${nClass ?? "px-12 py-5"} ${disabledClasses}`}
        disabled={disabled}
        onClick={onClick}
        id={id}
        ref={ref}
        {...rest}
      >
        {isOutline && (
          <div className="absolute inset-0 border border-(--byzantine-gold)/60 transition-all group-hover:border-(--byzantine-gold) group-hover:scale-95" />
        )}
        <div
          className={`absolute inset-0 bg-(--byzantine-gold) transition-transform duration-500 ease-out ${fillSlide}`}
        />
        <span
          className={`relative z-10 text-[10px] tracking-[0.4em] uppercase font-bold transition-colors duration-500 ${textColors}`}
        >
          {text}
        </span>
      </button>
    );
  },
);

export default Button;
