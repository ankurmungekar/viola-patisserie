"use client";

import Image from "next/image";
import { useEffect } from "react";
import { A11y, Keyboard, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { CloseIcon } from "@/components/icons";
import type { CustomCakeGalleryItem } from "@/types/custom-cakes";

import "swiper/css";
import "swiper/css/navigation";

interface CustomCakesLightboxProps {
  items: CustomCakeGalleryItem[];
  startIndex: number;
  onClose: () => void;
}

export function CustomCakesLightbox({
  items,
  startIndex,
  onClose,
}: CustomCakesLightboxProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 px-4 py-12"
      role="dialog"
      aria-modal="true"
      aria-label="Custom cakes gallery"
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute right-4 top-4 text-white hover:text-white/80"
        onClick={onClose}
        aria-label="Close gallery"
      >
        <CloseIcon />
      </button>
      <div
        className="relative h-full w-full max-w-5xl"
        onClick={(event) => event.stopPropagation()}
      >
        <Swiper
          modules={[Navigation, Keyboard, A11y]}
          navigation
          keyboard
          initialSlide={startIndex}
          className="custom-cakes-lightbox h-full"
          a11y={{
            prevSlideMessage: "Previous image",
            nextSlideMessage: "Next image",
          }}
        >
          {items.map((item) => (
            <SwiperSlide
              key={item.id}
              className="flex items-center justify-center"
            >
              <div className="relative mx-auto aspect-square h-full max-h-[80vh] w-full max-w-[80vh]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-contain"
                  sizes="80vw"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
