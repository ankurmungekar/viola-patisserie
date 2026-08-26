"use client";

import { useEffect, useState } from "react";
import { getDeliverySlots } from "@/lib/wordpress/delivery";
import type { DeliveryDateOption } from "@/types/delivery";

interface DeliveryTimePickerProps {
  pincode: string;
  pincodeValidated: boolean;
  selectedDate: string;
  selectedSlot: string;
  onDateChange: (date: string) => void;
  onSlotChange: (slot: string) => void;
}

const fieldClassName =
  "h-12 w-full border border-viola-border bg-white px-4 text-sm tracking-viola-wide text-viola-text focus:border-viola-primary focus:outline-none disabled:cursor-not-allowed disabled:bg-viola-topbar/40 disabled:text-viola-text/50";

export function DeliveryTimePicker({
  pincode,
  pincodeValidated,
  selectedDate,
  selectedSlot,
  onDateChange,
  onSlotChange,
}: DeliveryTimePickerProps) {
  const [dates, setDates] = useState<DeliveryDateOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!pincodeValidated || pincode.length !== 6) {
      setDates([]);
      return;
    }

    let cancelled = false;

    async function loadSlots() {
      setLoading(true);

      try {
        const response = await getDeliverySlots(pincode);
        if (!cancelled) {
          setDates(response.dates);
          if (response.dates.length > 0 && !selectedDate) {
            onDateChange(response.dates[0].date);
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadSlots();

    return () => {
      cancelled = true;
    };
  }, [pincode, pincodeValidated, onDateChange, selectedDate]);

  const selectedDateOption = dates.find((date) => date.date === selectedDate);
  const quickPick = dates[1] ?? dates[0];
  const controlsDisabled = !pincodeValidated || loading;

  return (
    <div>
      <p className="text-sm uppercase tracking-viola text-viola-accent">
        Pick the Best time to deliver
      </p>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <button
          type="button"
          onClick={() => quickPick && onDateChange(quickPick.date)}
          disabled={controlsDisabled || !quickPick}
          className={`${fieldClassName} text-left transition-colors ${
            quickPick && selectedDate === quickPick.date
              ? "border-viola-primary text-viola-primary"
              : "hover:border-viola-primary/50"
          }`}
        >
          {quickPick ? `Tomorrow, ${quickPick.label}` : "Tomorrow"}
        </button>

        <select
          value={selectedDate}
          onChange={(event) => onDateChange(event.target.value)}
          disabled={controlsDisabled || dates.length === 0}
          className={fieldClassName}
        >
          <option value="">Select Date</option>
          {dates.map((date) => (
            <option key={date.date} value={date.date}>
              {date.label}
            </option>
          ))}
        </select>

        <select
          value={selectedSlot}
          onChange={(event) => onSlotChange(event.target.value)}
          disabled={controlsDisabled || !selectedDateOption}
          className={fieldClassName}
        >
          <option value="">Select Time Slot</option>
          {selectedDateOption?.slots
            .filter((slot) => slot.available)
            .map((slot) => (
              <option key={slot.id} value={slot.id}>
                {slot.label}
              </option>
            ))}
        </select>
      </div>

      {!pincodeValidated ? (
        <p className="mt-2 text-sm tracking-viola-wide text-viola-text/70">
          Check your pincode above to enable delivery slots.
        </p>
      ) : loading ? (
        <p className="mt-2 text-sm tracking-viola-wide text-viola-text/70">
          Loading delivery slots...
        </p>
      ) : dates.length === 0 ? (
        <p className="mt-2 text-sm tracking-viola-wide text-red-600">
          No delivery slots available for this pincode.
        </p>
      ) : null}
    </div>
  );
}
