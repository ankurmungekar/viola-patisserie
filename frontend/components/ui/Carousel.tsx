"use client";

import type { ReactNode } from "react";
import { A11y, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { SwiperOptions } from "swiper/types";

import "swiper/css";
import "swiper/css/navigation";

interface CarouselProps {
  children: ReactNode[];
  options?: SwiperOptions;
  className?: string;
  slideClassName?: string;
  ariaLabel?: string;
  showNavigation?: boolean;
}

export function Carousel({
  children,
  options,
  className = "",
  slideClassName = "",
  ariaLabel = "Carousel",
  showNavigation = false,
}: CarouselProps) {
  const modules = showNavigation ? [Navigation, A11y] : [A11y];

  return (
    <Swiper
      modules={modules}
      navigation={showNavigation}
      a11y={{
        prevSlideMessage: "Previous slide",
        nextSlideMessage: "Next slide",
      }}
      className={`viola-carousel ${className}`}
      aria-label={ariaLabel}
      {...options}
    >
      {children.map((child, index) => (
        <SwiperSlide key={index} className={slideClassName}>
          {child}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
