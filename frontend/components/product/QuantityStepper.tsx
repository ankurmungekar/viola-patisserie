"use client";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
}: QuantityStepperProps) {
  return (
    <div className="inline-flex h-12 items-center border border-viola-border">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="flex h-full w-12 items-center justify-center text-xl text-viola-text disabled:opacity-40"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="flex h-full min-w-12 items-center justify-center border-x border-viola-border px-3 text-base tracking-viola-wide">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="flex h-full w-12 items-center justify-center text-xl text-viola-text disabled:opacity-40"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
