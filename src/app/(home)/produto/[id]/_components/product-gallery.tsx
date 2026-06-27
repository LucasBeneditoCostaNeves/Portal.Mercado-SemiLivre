"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  imageUrl: string;
  images: string[];
  title: string;
};

const PLACEHOLDER_ICON = "ti-device-mobile";

export default function ProductGallery({ imageUrl, images, title }: Props) {
  const allImages = [imageUrl, ...images.filter((img) => img !== imageUrl)].filter(Boolean);
  const [selected, setSelected] = useState(allImages[0] ?? null);

  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col gap-2 shrink-0">
        {allImages.length > 0 ? (
          allImages.map((img, index) => (
            <button
              key={img}
              onClick={() => setSelected(img)}
              aria-label={`Ver imagem ${index + 1}`}
              className={`w-12 h-12 bg-[var(--color-bg-secondary)] border rounded-md flex items-center justify-center overflow-hidden transition-colors ${
                selected === img
                  ? "border-[#2D3277]"
                  : "border-[var(--color-border)]"
              }`}
            >
              <Image
                src={img}
                alt={`${title} — miniatura ${index + 1}`}
                width={48}
                height={48}
                className="object-contain w-full h-full"
              />
            </button>
          ))
        ) : (
          <div className="w-12 h-12 bg-[var(--color-bg-secondary)] border border-[#2D3277] rounded-md flex items-center justify-center">
            <i className={`ti ${PLACEHOLDER_ICON} text-xl text-[var(--color-text-tertiary)]`} aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="flex-1 aspect-square bg-[var(--color-bg-secondary)] rounded-xl flex items-center justify-center overflow-hidden">
        {selected ? (
          <Image
            src={selected}
            alt={title}
            width={480}
            height={480}
            className="object-contain w-full h-full"
            priority
          />
        ) : (
          <i
            className={`ti ${PLACEHOLDER_ICON} text-[120px] text-[var(--color-text-tertiary)]`}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
