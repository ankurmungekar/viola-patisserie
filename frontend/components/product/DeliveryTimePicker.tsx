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

const DEFAULT_SLOT_ID = "10:00-13:00";
const CALENDAR_WINDOW_DAYS = 59;

function pickDefaultSlot(dateOption?: DeliveryDateOption): string {
  const available = dateOption?.slots.filter((slot) => slot.available) ?? [];
  const preferred = available.find((slot) => slot.id === DEFAULT_SLOT_ID);

  return preferred?.id ?? available[0]?.id ?? "";
}

function addCalendarDays(dateKey: string, days: number): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, (month ?? 1) - 1, day ?? 1);
  date.setDate(date.getDate() + days);

  const nextYear = date.getFullYear();
  const nextMonth = String(date.getMonth() + 1).padStart(2, "0");
  const nextDay = String(date.getDate()).padStart(2, "0");

  return `${nextYear}-${nextMonth}-${nextDay}`;
}

export function DeliveryTimePicker({
  pincode,
  pincodeValidated,
  selectedDate,
  selectedSlot,
  onDateChange,
  onSlotChange,
}: DeliveryTimePickerProps) {
  const [dates, setDates] = useState<DeliveryDateOption[]>([]);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [blackoutDates, setBlackoutDates] = useState<string[]>([]);
  const [fallbackSlots, setFallbackSlots] = useState<DeliveryDateOption["slots"]>(
    [],
  );
  const [dateError, setDateError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!pincodeValidated || pincode.length !== 6) {
      setDates([]);
      setMinDate("");
      setMaxDate("");
      setBlackoutDates([]);
      setFallbackSlots([]);
      setDateError("");
      return;
    }

    let cancelled = false;

    async function loadSlots() {
      setLoading(true);

      try {
        const response = await getDeliverySlots(pincode);
        if (!cancelled) {
          setDates(response.dates);
          setBlackoutDates(response.blackoutDates ?? []);
          setFallbackSlots(response.timeSlots ?? response.dates[0]?.slots ?? []);
          const nextMin = response.minDate || response.dates[0]?.date || "";
          const nextMax =
            response.maxDate ||
            (nextMin ? addCalendarDays(nextMin, CALENDAR_WINDOW_DAYS) : "");
          setMinDate(nextMin);
          setMaxDate(nextMax);

          const nextDate = response.dates[0]?.date ?? "";

          if (nextDate) {
            onDateChange(nextDate);
            onSlotChange(pickDefaultSlot(response.dates[0]));
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
  }, [pincode, pincodeValidated, onDateChange, onSlotChange]);

  function handleDateChange(date: string) {
    if (!date) {
      return;
    }

    if (blackoutDates.includes(date)) {
      setDateError("Delivery is not available on this date. Please pick another.");
      return;
    }

    const option =
      dates.find((entry) => entry.date === date) ??
      (fallbackSlots.length > 0
        ? { date, label: date, slots: fallbackSlots }
        : undefined);

    setDateError("");
    onDateChange(date);
    onSlotChange(pickDefaultSlot(option));
  }

  const selectedDateOption =
    dates.find((date) => date.date === selectedDate) ??
    (selectedDate && fallbackSlots.length > 0
      ? { date: selectedDate, label: selectedDate, slots: fallbackSlots }
      : undefined);
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
          onClick={() => quickPick && handleDateChange(quickPick.date)}
          disabled={controlsDisabled || !quickPick}
          className={`${fieldClassName} text-left transition-colors ${
            quickPick && selectedDate === quickPick.date
              ? "border-viola-primary text-viola-primary"
              : "hover:border-viola-primary/50"
          }`}
        >
          {quickPick ? `Tomorrow, ${quickPick.label}` : "Tomorrow"}
        </button>

        <input
          type="date"
          value={selectedDate}
          min={minDate || undefined}
          max={maxDate || undefined}
          onChange={(event) => handleDateChange(event.target.value)}
          onClick={(event) => {
            try {
              event.currentTarget.showPicker?.();
            } catch {
              // The native calendar still opens from the date control.
            }
          }}
          disabled={controlsDisabled || !minDate}
          className={fieldClassName}
          aria-label="Select Date"
        />

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

      {dateError ? (
        <p className="mt-2 text-sm tracking-viola-wide text-red-600">{dateError}</p>
      ) : !pincodeValidated ? (
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
