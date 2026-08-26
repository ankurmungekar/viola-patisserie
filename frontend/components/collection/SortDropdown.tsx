"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDownIcon } from "@/components/icons";
import {
  COLLECTION_SORT_OPTIONS,
  type CollectionSortValue,
  DEFAULT_COLLECTION_SORT,
} from "@/lib/config/collection-filters";

interface SortDropdownProps {
  className?: string;
}

export function SortDropdown({ className = "" }: SortDropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentSort =
    (searchParams.get("sort") as CollectionSortValue | null) ??
    DEFAULT_COLLECTION_SORT;

  const currentLabel =
    COLLECTION_SORT_OPTIONS.find((option) => option.value === currentSort)
      ?.label ?? "Sort by";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(value: CollectionSortValue) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === DEFAULT_COLLECTION_SORT) {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        className="inline-flex h-[30px] items-center gap-2.5 border border-viola-primary bg-white px-3 text-sm tracking-viola-wide text-viola-primary"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{currentLabel}</span>
        <ChevronDownIcon />
      </button>

      {open ? (
        <ul
          role="listbox"
          className="absolute right-0 z-20 mt-1 min-w-[180px] border border-viola-border bg-white py-1 shadow-sm"
        >
          {COLLECTION_SORT_OPTIONS.filter(
            (option) => option.value !== "popularity",
          ).map((option) => (
            <li key={option.value} role="option" aria-selected={currentSort === option.value}>
              <button
                type="button"
                className="block w-full px-4 py-2 text-left text-sm tracking-viola-wide text-viola-text hover:bg-viola-topbar"
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
