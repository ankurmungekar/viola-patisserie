import { valuePropIconMap } from "@/lib/config/value-prop-icons";
import type { ValuePropContent } from "@/types/homepage";

interface ValuePropsSectionProps {
  valueProps: ValuePropContent[];
}

export function ValuePropsSection({ valueProps }: ValuePropsSectionProps) {
  return (
    <section className="bg-white py-16 md:py-20" aria-label="Why Viola Patisserie">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 xl:px-[100px]">
        <div className="reveal-stagger grid grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-4 xl:gap-0">
          {valueProps.map(({ title, description, icon }, index) => {
            const Icon = valuePropIconMap[icon] ?? valuePropIconMap.badge;

            return (
              <div key={`${title}-${index}`} className="relative px-4 text-center xl:px-6">
                {index > 0 ? (
                  <div
                    aria-hidden="true"
                    className="absolute left-0 top-1/2 hidden h-[142px] w-px -translate-y-1/2 bg-gradient-to-b from-white via-viola-primary to-white opacity-30 xl:block"
                  />
                ) : null}

                <div className="mx-auto mb-4 flex h-[46px] w-[46px] items-center justify-center">
                  <Icon />
                </div>
                <h3 className="font-display text-xl font-semibold text-viola-accent">
                  {title}
                </h3>
                <p className="mx-auto mt-3 max-w-[250px] text-sm leading-5 tracking-viola-wide text-viola-text">
                  {description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
