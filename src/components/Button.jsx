import { forwardRef } from "react";

const Button = forwardRef(
  (
    {
      text = undefined,
      children,
      nClass,
      variant = "outline",
      disabled = false,
      type = "button",
      onClick = undefined,
      id,
      ...rest
    },
    ref,
  ) => {
    const isOutline = variant === "outline";
    const isPrimary = variant === "primary";
    const disabledClasses = disabled
      ? "opacity-40 cursor-not-allowed pointer-events-none"
      : "";
    const baseClasses = "group relative overflow-hidden";

    const fillSlide = isPrimary
      ? "translate-y-0"
      : disabled
        ? "translate-y-full"
        : "translate-y-full group-hover:translate-y-0";

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
        type={type}
        disabled={disabled}
        onClick={onClick}
        id={id}
        ref={ref}
        {...rest}
      >
        <div
          className={`absolute inset-0 border transition-all ${
            isPrimary
              ? "border-(--byzantine-gold) scale-100"
              : "border-(--byzantine-gold)/60 group-hover:border-(--byzantine-gold) group-hover:scale-95"
          }`}
        />
        <div
          className={`absolute inset-0 bg-(--byzantine-gold) transition-transform duration-500 ease-out ${fillSlide}`}
        />
        <span
          className={`relative z-10 text-[10px] tracking-[0.4em] uppercase font-bold transition-colors duration-500 ${textColors} ${children ? "inline-flex items-center justify-center gap-2" : ""}`}
        >
          {children ?? text}
        </span>
      </button>
    );
  },
);

export default Button;
