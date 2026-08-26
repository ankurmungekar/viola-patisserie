"use client";

import { FilterIcon } from "@/components/icons";
import { SortDropdown } from "@/components/collection/SortDropdown";

interface CollectionToolbarProps {
  resultCount: number;
  onFilterOpen: () => void;
  activeFilterCount?: number;
}

export function CollectionToolbar({
  resultCount,
  onFilterOpen,
  activeFilterCount = 0,
}: CollectionToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <p className="text-sm tracking-viola-wide text-viola-text">
        Showing {resultCount} Result{resultCount === 1 ? "" : "s"}
      </p>

      <div className="flex items-center gap-3">
        <SortDropdown />
        <button
          type="button"
          className="inline-flex h-[30px] items-center gap-2.5 bg-viola-primary px-3 text-sm tracking-viola-wide text-white"
          onClick={onFilterOpen}
        >
          <span>Filter</span>
          <FilterIcon />
          {activeFilterCount > 0 ? (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs text-viola-primary">
              {activeFilterCount}
            </span>
          ) : null}
        </button>
      </div>
    </div>
  );
}
