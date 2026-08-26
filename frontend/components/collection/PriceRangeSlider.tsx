"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/utils/format-price";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
}: PriceRangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);

  const range = Math.max(max - min, 1);
  const minPercent = ((value[0] - min) / range) * 100;
  const maxPercent = ((value[1] - min) / range) * 100;

  const getValueFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) {
        return min;
      }

      const rect = track.getBoundingClientRect();
      const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      return Math.round(min + ratio * range);
    },
    [min, range],
  );

  useEffect(() => {
    if (!dragging) {
      return;
    }

    function handlePointerMove(event: PointerEvent) {
      const nextValue = getValueFromClientX(event.clientX);

      if (dragging === "min") {
        onChange([Math.min(nextValue, value[1]), value[1]]);
        return;
      }

      onChange([value[0], Math.max(nextValue, value[0])]);
    }

    function handlePointerUp() {
      setDragging(null);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragging, getValueFromClientX, onChange, value]);

  return (
    <div>
      <div ref={trackRef} className="relative h-2 rounded-full bg-[#E8D5EE]">
        <div
          className="absolute top-0 h-2 rounded-full bg-viola-primary"
          style={{
            left: `${minPercent}%`,
            width: `${Math.max(maxPercent - minPercent, 0)}%`,
          }}
        />
        <button
          type="button"
          aria-label="Minimum price"
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-viola-primary"
          style={{ left: `${minPercent}%` }}
          onPointerDown={(event) => {
            event.preventDefault();
            setDragging("min");
          }}
        />
        <button
          type="button"
          aria-label="Maximum price"
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-viola-primary"
          style={{ left: `${maxPercent}%` }}
          onPointerDown={(event) => {
            event.preventDefault();
            setDragging("max");
          }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-sm tracking-viola-wide text-viola-text">
        <span>{formatPrice(value[0])}</span>
        <span>{formatPrice(value[1])}</span>
      </div>
    </div>
  );
}
