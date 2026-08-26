import type { ReactNode } from "react";

interface FilterSectionProps {
  title: string;
  children: ReactNode;
}

export function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <section className="border-b border-viola-border py-6">
      <h3 className="text-base font-semibold tracking-viola-wide text-viola-text">
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}
