"use client";

interface ProductOptionSelectProps {
  id: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export function ProductOptionSelect({
  id,
  label,
  options,
  value,
  onChange,
}: ProductOptionSelectProps) {
  if (options.length === 0) {
    return null;
  }

  return (
    <div>
      <label
        htmlFor={id}
        className="text-sm uppercase tracking-viola text-viola-accent"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 h-12 w-full appearance-none border border-viola-border bg-white px-4 text-base tracking-viola-wide text-viola-text focus:border-viola-primary focus:outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
