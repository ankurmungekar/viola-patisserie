"use client";

import Image from "next/image";
import { useState } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { ProductImage } from "@/types/product";

import "swiper/css";
import "swiper/css/thumbs";

interface ProductGalleryProps {
  images: ProductImage[];
  className?: string;
}

export function ProductGallery({ images, className = "" }: ProductGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperInstance | null>(null);

  if (images.length === 0) {
    return null;
  }

  if (images.length === 1) {
    const image = images[0];

    return (
      <div className={`w-full max-w-[540px] lg:sticky lg:top-[152px] ${className}`}>
        <div className="relative aspect-square w-full overflow-hidden bg-[#F4F0F2]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 540px"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`product-gallery w-full max-w-[540px] lg:sticky lg:top-[152px] ${className}`}
    >
      <Swiper
        modules={[Thumbs, A11y]}
        thumbs={{
          swiper:
            thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        speed={400}
        spaceBetween={0}
        className="product-gallery-main aspect-square w-full bg-[#F4F0F2]"
        a11y={{
          prevSlideMessage: "Previous product image",
          nextSlideMessage: "Next product image",
        }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={`${image.src}-${index}`}>
            <div className="relative aspect-square w-full">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 540px"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        modules={[Thumbs, A11y]}
        onSwiper={setThumbsSwiper}
        watchSlidesProgress
        spaceBetween={16}
        slidesPerView={4}
        className="product-gallery-thumbs mt-5"
        a11y={{
          slideLabelMessage: "Product image {{index}} of {{slidesLength}}",
        }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={`thumb-${image.src}-${index}`}>
            <div className="relative aspect-square w-full overflow-hidden border-2 border-viola-border transition-colors">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="120px"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
