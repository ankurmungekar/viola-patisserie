"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { CustomCakesLightbox } from "@/components/custom-cakes/CustomCakesLightbox";
import { Button } from "@/components/ui/Button";
import {
  customCakeGalleryTabs,
  type CustomCakeGalleryContent,
  type CustomCakeOccasion,
} from "@/types/custom-cakes";

interface CustomCakesGalleryProps {
  content: CustomCakeGalleryContent;
}

const INITIAL_COUNT = 12;

export function CustomCakesGallery({ content }: CustomCakesGalleryProps) {
  const { eyebrow, title, titleAccent, viewMoreLabel, emptyMessage, items } =
    content;
  const [occasion, setOccasion] = useState<CustomCakeOccasion>("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (occasion === "all") {
      return items;
    }

    return items.filter((item) => item.occasion === occasion);
  }, [items, occasion]);

  const visible = filtered.slice(0, visibleCount);

  function handleTabChange(next: CustomCakeOccasion) {
    setOccasion(next);
    setVisibleCount(INITIAL_COUNT);
    setLightboxIndex(null);
  }

  return (
    <section className="py-16 md:py-20" aria-labelledby="custom-cakes-gallery">
      <div className="mx-auto max-w-[610px] text-center">
        <p className="text-sm uppercase tracking-viola text-viola-accent">
          {eyebrow}
        </p>
        <h2
          id="custom-cakes-gallery"
          className="mt-2 font-display text-4xl font-semibold md:text-5xl"
        >
          {title} <span className="text-viola-accent">{titleAccent}</span>
        </h2>
      </div>

      <nav
        aria-label="Gallery categories"
        className="mt-8 border-b border-viola-border"
      >
        <ul className="-mb-px flex justify-center gap-6 overflow-x-auto pb-px md:gap-10">
          {customCakeGalleryTabs.map((tab) => {
            const isActive = tab.id === occasion;

            return (
              <li key={tab.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`inline-block border-b-2 pb-3 text-sm uppercase tracking-viola transition-colors ${
                    isActive
                      ? "border-viola-primary font-medium text-viola-text"
                      : "border-transparent text-viola-text hover:text-viola-primary"
                  }`}
                  aria-current={isActive ? "true" : undefined}
                >
                  {tab.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {visible.length === 0 ? (
        <p className="mt-10 text-center text-base tracking-viola-wide text-viola-text/70">
          {emptyMessage}
        </p>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {visible.map((item) => {
            const filteredIndex = filtered.findIndex(
              (entry) => entry.id === item.id,
            );

            return (
              <li key={item.id}>
                <button
                  type="button"
                  className="block w-full text-left"
                  onClick={() => setLightboxIndex(filteredIndex)}
                  aria-label={`View larger image: ${item.alt}`}
                >
                  <div className="relative aspect-square overflow-hidden bg-[#F4F0F2]">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {filtered.length > visibleCount ? (
        <div className="mt-10 flex justify-center">
          <Button
            variant="outline"
            onClick={() => setVisibleCount((count) => count + INITIAL_COUNT)}
          >
            {viewMoreLabel}
          </Button>
        </div>
      ) : null}

      {lightboxIndex !== null && filtered[lightboxIndex] ? (
        <CustomCakesLightbox
          items={filtered}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      ) : null}
    </section>
  );
}
