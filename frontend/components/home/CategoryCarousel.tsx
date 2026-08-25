"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CategoryCard } from "@/components/home/CategoryCard";
import {
  CATEGORY_CARD_GAP,
  CATEGORY_CARD_WIDTH,
  CATEGORY_CAROUSEL_VISIBLE,
  getCategoryCarouselOffset,
} from "@/lib/config/category-carousel";
import { A11y } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

import type { Category } from "@/types/category";

interface CategoryCarouselProps {
  categories: Category[];
}

interface CarouselSlide {
  category: Category;
  key: string;
}

function buildCarouselSlides(categories: Category[]): {
  slides: CarouselSlide[];
  initialSlide: number;
} {
  if (categories.length > CATEGORY_CAROUSEL_VISIBLE) {
    const lastCategory = categories[categories.length - 1];

    return {
      slides: [
        { category: lastCategory, key: `peek-${lastCategory.id}` },
        ...categories.map((category) => ({
          category,
          key: String(category.id),
        })),
      ],
      initialSlide: 1,
    };
  }

  return {
    slides: categories.map((category) => ({
      category,
      key: String(category.id),
    })),
    initialSlide: 0,
  };
}

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [sideOffset, setSideOffset] = useState(() =>
    typeof window !== "undefined"
      ? getCategoryCarouselOffset(window.innerWidth)
      : 16,
  );

  const { slides, initialSlide } = useMemo(
    () => buildCarouselSlides(categories),
    [categories],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const updateOffset = () => {
      setSideOffset(getCategoryCarouselOffset(container.clientWidth));
    };

    updateOffset();

    const resizeObserver = new ResizeObserver(updateOffset);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (swiper && !swiper.destroyed) {
      swiper.params.slidesOffsetBefore = sideOffset;
      swiper.update();
    }
  }, [sideOffset]);

  return (
    <div
      ref={containerRef}
      className="viola-category-carousel relative left-1/2 w-screen -translate-x-1/2"
    >
      <Swiper
        modules={[A11y]}
        initialSlide={initialSlide}
        slidesOffsetBefore={sideOffset}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        slidesPerView="auto"
        spaceBetween={CATEGORY_CARD_GAP}
        grabCursor
        resistance
        resistanceRatio={0.85}
        a11y={{
          prevSlideMessage: "Previous category",
          nextSlideMessage: "Next category",
        }}
        aria-label="Signature collection categories"
      >
        {slides.map(({ category, key }) => (
          <SwiperSlide
            key={key}
            style={{ width: CATEGORY_CARD_WIDTH }}
            className="!h-auto"
          >
            <CategoryCard category={category} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
