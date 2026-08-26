"use client";

interface CakeMessageInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function CakeMessageInput({ value, onChange }: CakeMessageInputProps) {
  return (
    <div>
      <label
        htmlFor="cake-message"
        className="text-sm uppercase tracking-viola text-viola-accent"
      >
        Cake Message
      </label>
      <input
        id="cake-message"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Write a sweet message for your loved one"
        className="mt-3 h-12 w-full border border-viola-border px-4 text-base tracking-viola-wide text-viola-text placeholder:text-viola-text/50 focus:border-viola-primary focus:outline-none"
      />
    </div>
  );
}
