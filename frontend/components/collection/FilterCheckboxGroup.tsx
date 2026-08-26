"use client";

import { useState } from "react";
import type { FilterTermOption } from "@/lib/woocommerce/collection";

interface FilterCheckboxGroupProps {
  options: FilterTermOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  initialVisibleCount?: number;
}

export function FilterCheckboxGroup({
  options,
  selected,
  onChange,
  initialVisibleCount = 7,
}: FilterCheckboxGroupProps) {
  const [expanded, setExpanded] = useState(false);

  if (options.length === 0) {
    return null;
  }

  const visibleOptions = expanded
    ? options
    : options.slice(0, initialVisibleCount);
  const hasMore = options.length > initialVisibleCount;

  function toggleOption(slug: string) {
    if (selected.includes(slug)) {
      onChange(selected.filter((value) => value !== slug));
      return;
    }

    onChange([...selected, slug]);
  }

  return (
    <div>
      <ul className="space-y-3">
        {visibleOptions.map((option) => {
          const id = `filter-${option.slug}`;
          const checked = selected.includes(option.slug);

          return (
            <li key={option.slug}>
              <label
                htmlFor={id}
                className="flex cursor-pointer items-center gap-3 text-sm tracking-viola-wide text-viola-text"
              >
                <input
                  id={id}
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleOption(option.slug)}
                  className="h-4 w-4 shrink-0 rounded-none border border-viola-border accent-viola-primary"
                />
                <span>
                  {option.name}{" "}
                  <span className="text-viola-text/60">({option.count})</span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      {hasMore ? (
        <button
          type="button"
          className="mt-4 text-sm tracking-viola-wide text-viola-primary hover:underline"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "View less" : "View more"}
        </button>
      ) : null}
    </div>
  );
}
