"use client";

import { useEffect, useState } from "react";
import { CalendarIcon, ClockIcon } from "@/components/icons";
import { formatCartDeliveryDate } from "@/lib/utils/format-delivery-date";
import { resolveDeliverySlotLabel } from "@/lib/utils/delivery-display";
import { getDeliverySlots } from "@/lib/wordpress/delivery";
import { updateCartDeliverySchedule } from "@/lib/woocommerce/cart";
import type { DeliveryDateOption } from "@/types/delivery";
import type { CartItem } from "@/types/cart";

interface CartDeliveryScheduleProps {
  items: CartItem[];
  onUpdated: () => Promise<void>;
}

type EditingField = "date" | "slot" | null;

const fieldClassName =
  "h-12 w-full border border-viola-border bg-white px-4 text-sm tracking-viola-wide text-viola-text focus:border-viola-primary focus:outline-none disabled:cursor-not-allowed disabled:bg-viola-topbar/40 disabled:text-viola-text/50";

function getScheduleFromItems(items: CartItem[]) {
  const reference = items[0]?.extensions;

  return {
    date: reference?.deliveryDate ?? "",
    slot: reference?.deliverySlot ?? "",
    pincode: reference?.deliveryPincode ?? "",
    zone: reference?.deliveryZone ?? "",
  };
}

export function CartDeliverySchedule({
  items,
  onUpdated,
}: CartDeliveryScheduleProps) {
  const { date, slot, pincode, zone } = getScheduleFromItems(items);
  const [editingField, setEditingField] = useState<EditingField>(null);
  const [dates, setDates] = useState<DeliveryDateOption[]>([]);
  const [loadingDates, setLoadingDates] = useState(false);
  const [slotLabel, setSlotLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const pincodeReady = pincode.length === 6;
  const selectedDateOption = dates.find((entry) => entry.date === date);

  useEffect(() => {
    let cancelled = false;

    async function loadSlotLabel() {
      if (!slot) {
        setSlotLabel("");
        return;
      }

      const label = await resolveDeliverySlotLabel(pincode, date, slot);

      if (!cancelled) {
        setSlotLabel(label);
      }
    }

    void loadSlotLabel();

    return () => {
      cancelled = true;
    };
  }, [pincode, date, slot]);

  useEffect(() => {
    if (!editingField || !pincodeReady) {
      return;
    }

    let cancelled = false;

    async function loadDates() {
      setLoadingDates(true);
      setError("");

      try {
        const response = await getDeliverySlots(pincode);
        if (!cancelled) {
          setDates(response.dates);
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load delivery options. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoadingDates(false);
        }
      }
    }

    void loadDates();

    return () => {
      cancelled = true;
    };
  }, [editingField, pincode, pincodeReady]);

  async function persistSchedule(nextDate: string, nextSlot: string) {
    if (!nextDate || !nextSlot) {
      setError("Please select a valid delivery date and time slot.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await updateCartDeliverySchedule({
        deliveryDate: nextDate,
        deliverySlot: nextSlot,
        deliveryPincode: pincode,
        deliveryZone: zone,
      });
      await onUpdated();
      setEditingField(null);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to update delivery schedule.",
      );
    } finally {
      setSaving(false);
    }
  }

  function openDateEditor() {
    if (!pincodeReady) {
      setError("Delivery pincode is missing from your cart items.");
      setEditingField(null);
      return;
    }

    setError("");
    setEditingField("date");
  }

  function openSlotEditor() {
    if (!pincodeReady) {
      setError("Delivery pincode is missing from your cart items.");
      setEditingField(null);
      return;
    }

    if (!date) {
      setError("Please set a delivery date first.");
      setEditingField(null);
      return;
    }

    setError("");
    setEditingField("slot");
  }

  async function handleDateChange(nextDate: string) {
    if (!nextDate || saving) {
      return;
    }

    if (nextDate === date) {
      setEditingField(null);
      return;
    }

    const nextDateOption = dates.find((entry) => entry.date === nextDate);
    let nextSlot = slot;

    if (
      nextDateOption &&
      slot &&
      !nextDateOption.slots.some(
        (entry) => entry.id === slot && entry.available,
      )
    ) {
      nextSlot = nextDateOption.slots.find((entry) => entry.available)?.id ?? "";
    }

    if (!nextSlot) {
      setError("No time slots available for the selected date.");
      return;
    }

    await persistSchedule(nextDate, nextSlot);
  }

  async function handleSlotChange(nextSlot: string) {
    if (!nextSlot || saving) {
      return;
    }

    if (nextSlot === slot) {
      setEditingField(null);
      return;
    }

    if (!date) {
      setError("Please set a delivery date first.");
      return;
    }

    await persistSchedule(date, nextSlot);
  }

  const formattedDate = date ? formatCartDeliveryDate(date) : "Not selected";
  const formattedSlot = slot ? slotLabel || slot : "Not selected";

  return (
    <div className="border border-[#F0F0F0] bg-viola-topbar p-4">
      <div className="flex gap-3">
        <div className="mt-0.5 text-viola-text">
          <CalendarIcon />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm tracking-viola-wide text-viola-text">Date</p>
              {editingField === "date" ? (
                <select
                  value={date}
                  onChange={(event) => void handleDateChange(event.target.value)}
                  disabled={loadingDates || saving || dates.length === 0}
                  className={`${fieldClassName} mt-1`}
                  autoFocus
                >
                  <option value="">Select Date</option>
                  {dates.map((entry) => (
                    <option key={entry.date} value={entry.date}>
                      {entry.label}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="mt-1 text-lg leading-5 tracking-viola-wide text-viola-text">
                  {formattedDate}
                </p>
              )}
            </div>
            {editingField !== "date" ? (
              <button
                type="button"
                onClick={openDateEditor}
                disabled={saving}
                className="shrink-0 text-base tracking-viola-wide text-viola-primary hover:underline disabled:opacity-50"
              >
                Change
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-3 border-t border-viola-border/60 pt-4">
        <div className="mt-0.5 text-viola-text">
          <ClockIcon />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm tracking-viola-wide text-viola-text">
                Time Slot
              </p>
              {editingField === "slot" ? (
                <select
                  value={slot}
                  onChange={(event) => void handleSlotChange(event.target.value)}
                  disabled={
                    loadingDates || saving || !selectedDateOption
                  }
                  className={`${fieldClassName} mt-1`}
                  autoFocus
                >
                  <option value="">Select Time Slot</option>
                  {selectedDateOption?.slots
                    .filter((entry) => entry.available)
                    .map((entry) => (
                      <option key={entry.id} value={entry.id}>
                        {entry.label}
                      </option>
                    ))}
                </select>
              ) : (
                <p className="mt-1 text-lg leading-5 tracking-viola-wide text-viola-text">
                  {formattedSlot}
                </p>
              )}
            </div>
            {editingField !== "slot" ? (
              <button
                type="button"
                onClick={openSlotEditor}
                disabled={saving}
                className="shrink-0 text-base tracking-viola-wide text-viola-primary hover:underline disabled:opacity-50"
              >
                Change
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {loadingDates && editingField ? (
        <p className="mt-3 text-sm tracking-viola-wide text-viola-text/70">
          Loading delivery options...
        </p>
      ) : null}

      {saving ? (
        <p className="mt-3 text-sm tracking-viola-wide text-viola-text/70">
          Updating...
        </p>
      ) : null}

      {error ? (
        <p className="mt-3 text-sm tracking-viola-wide text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
