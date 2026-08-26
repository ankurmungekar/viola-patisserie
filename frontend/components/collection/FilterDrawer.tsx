"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CloseIcon } from "@/components/icons";
import { FilterCheckboxGroup } from "@/components/collection/FilterCheckboxGroup";
import { FilterSection } from "@/components/collection/FilterSection";
import { PriceRangeSlider } from "@/components/collection/PriceRangeSlider";
import type { CollectionFilterData } from "@/lib/woocommerce/collection";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filterData: CollectionFilterData;
}

export function FilterDrawer({ open, onClose, filterData }: FilterDrawerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [flavours, setFlavours] = useState<string[]>([]);
  const [dietary, setDietary] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filterData.priceRange.min,
    filterData.priceRange.max,
  ]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const flavourParam = searchParams.get("flavour");
    const dietaryParam = searchParams.get("dietary");
    const minPrice = Number.parseInt(searchParams.get("minPrice") ?? "", 10);
    const maxPrice = Number.parseInt(searchParams.get("maxPrice") ?? "", 10);

    setFlavours(flavourParam ? flavourParam.split(",").filter(Boolean) : []);
    setDietary(dietaryParam ? dietaryParam.split(",").filter(Boolean) : []);
    setPriceRange([
      Number.isNaN(minPrice) ? filterData.priceRange.min : minPrice,
      Number.isNaN(maxPrice) ? filterData.priceRange.max : maxPrice,
    ]);
  }, [open, searchParams, filterData.priceRange.min, filterData.priceRange.max]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  function handleApply() {
    const params = new URLSearchParams(searchParams.toString());

    if (flavours.length > 0) {
      params.set("flavour", flavours.join(","));
    } else {
      params.delete("flavour");
    }

    if (dietary.length > 0) {
      params.set("dietary", dietary.join(","));
    } else {
      params.delete("dietary");
    }

    if (priceRange[0] > filterData.priceRange.min) {
      params.set("minPrice", String(priceRange[0]));
    } else {
      params.delete("minPrice");
    }

    if (priceRange[1] < filterData.priceRange.max) {
      params.set("maxPrice", String(priceRange[1]));
    } else {
      params.delete("maxPrice");
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
    onClose();
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-[400px] flex-col bg-white shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
        aria-label="Product filters"
      >
        <div className="flex items-center justify-between border-b border-viola-border px-6 py-5">
          <h2 className="font-display text-3xl font-semibold text-viola-primary">
            Filters
          </h2>
          <button
            type="button"
            className="text-viola-text"
            aria-label="Close filters"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {filterData.flavours.length > 0 ? (
            <FilterSection title="Flavour">
              <FilterCheckboxGroup
                options={filterData.flavours}
                selected={flavours}
                onChange={setFlavours}
              />
            </FilterSection>
          ) : null}

          {filterData.dietary.length > 0 ? (
            <FilterSection title="Dietary">
              <FilterCheckboxGroup
                options={filterData.dietary}
                selected={dietary}
                onChange={setDietary}
              />
            </FilterSection>
          ) : null}

          <FilterSection title="Price Range">
            <PriceRangeSlider
              min={filterData.priceRange.min}
              max={filterData.priceRange.max}
              value={priceRange}
              onChange={setPriceRange}
            />
          </FilterSection>
        </div>

        <div className="border-t border-viola-border p-6">
          <button
            type="button"
            className="h-12 w-full bg-viola-primary text-base tracking-viola-wide text-white"
            onClick={handleApply}
          >
            Apply Filters
          </button>
        </div>
      </aside>
    </>
  );
}
