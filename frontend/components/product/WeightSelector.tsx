"use client";

interface WeightSelectorProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

export function WeightSelector({
  options,
  selected,
  onChange,
}: WeightSelectorProps) {
  return (
    <div>
      <p className="text-sm uppercase tracking-viola text-viola-accent">
        Weight
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {options.map((option) => {
          const isSelected = option === selected;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`h-12 border px-3 text-sm tracking-viola-wide transition-colors ${
                isSelected
                  ? "border-viola-primary text-viola-primary"
                  : "border-viola-border text-viola-text hover:border-viola-primary/50"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
