import {
  BadgeIcon,
  CakeIcon,
  ChatIcon,
  HeartIcon,
} from "@/components/icons";
import type {
  CustomCakeHighlight,
  CustomCakeHighlightIcon,
} from "@/types/custom-cakes";

const icons: Record<CustomCakeHighlightIcon, typeof BadgeIcon> = {
  cake: CakeIcon,
  badge: BadgeIcon,
  heart: HeartIcon,
  chat: ChatIcon,
};

interface CustomCakesHighlightsProps {
  highlights: CustomCakeHighlight[];
}

export function CustomCakesHighlights({
  highlights,
}: CustomCakesHighlightsProps) {
  return (
    <section
      aria-label="Why order a custom cake"
      className="border-y border-viola-border"
    >
      <ul className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
        {highlights.map((item, index) => {
          const Icon = icons[item.icon];

          return (
            <li
              key={item.id}
              className={`px-4 text-center lg:px-6 ${
                index > 0 ? "lg:border-l lg:border-viola-border" : ""
              }`}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center text-viola-accent">
                {item.icon === "cake" ? (
                  <CakeIcon className="h-11 w-11" />
                ) : (
                  <Icon />
                )}
              </div>
              <h2 className="mt-3 font-display text-xl font-semibold text-viola-accent">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-5 tracking-viola-wide text-viola-text">
                {item.description}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
