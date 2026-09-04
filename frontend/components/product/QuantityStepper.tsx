"use client";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "default" | "compact";
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "default",
}: QuantityStepperProps) {
  const isCompact = size === "compact";

  return (
    <div
      className={`inline-flex items-center border border-viola-border bg-white ${
        isCompact ? "h-10 gap-[30px] px-3" : "h-12"
      }`}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={`flex items-center justify-center text-viola-text disabled:opacity-40 ${
          isCompact ? "h-6 w-6 text-lg" : "h-full w-12 text-xl"
        }`}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span
        className={`flex items-center justify-center text-base tracking-viola-wide ${
          isCompact ? "min-w-4" : "h-full min-w-12 border-x border-viola-border px-3"
        }`}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={`flex items-center justify-center text-viola-text disabled:opacity-40 ${
          isCompact ? "h-6 w-6 text-lg" : "h-full w-12 text-xl"
        }`}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
