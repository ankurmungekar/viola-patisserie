"use client";

interface OrderNoteInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function OrderNoteInput({ value, onChange }: OrderNoteInputProps) {
  return (
    <div className="border-t border-viola-border pt-6">
      <label
        htmlFor="order-note"
        className="text-sm uppercase tracking-viola text-viola-accent"
      >
        Add a note
      </label>
      <textarea
        id="order-note"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Any special instructions for this item"
        rows={4}
        className="mt-3 w-full resize-y border border-viola-border px-4 py-3 text-base tracking-viola-wide text-viola-text placeholder:text-viola-text/50 focus:border-viola-primary focus:outline-none"
      />
    </div>
  );
}
