'use client'

import Image from 'next/image'
import { useState } from 'react'

type Props = {
  imageUrl: string
  images: string[]
  title: string
}

type MousePos = {
  x: number
  y: number
  w: number
  h: number
}

const PLACEHOLDER_ICON = 'ti-device-mobile'
const ZOOM_FACTOR = 3
const LENS_SIZE = 160

export default function ProductGallery({ imageUrl, images, title }: Props) {
  const allImages = (images.length > 0 ? images : [imageUrl]).filter(Boolean)
  const [selected, setSelected] = useState(allImages[0] ?? null)
  const [mousePos, setMousePos] = useState<MousePos | null>(null)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      w: rect.width,
      h: rect.height,
    })
  }

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
                  ? 'border-[#2D3277]'
                  : 'border-[var(--color-border)]'
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
            <i
              className={`ti ${PLACEHOLDER_ICON} text-xl text-[var(--color-text-tertiary)]`}
              aria-hidden="true"
            />
          </div>
        )}
      </div>

      <div
        className="flex-1 aspect-square bg-[var(--color-bg-secondary)] rounded-xl relative overflow-hidden"
        style={{ cursor: mousePos && selected ? 'crosshair' : 'default' }}
        onMouseMove={selected ? handleMouseMove : undefined}
        onMouseLeave={() => setMousePos(null)}
      >
        {selected ? (
          <>
            <Image
              src={selected}
              alt={title}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 55vw, 640px"
            />
            {mousePos && (
              <div
                className="pointer-events-none absolute rounded-full border-2 border-white/60 shadow-xl overflow-hidden"
                style={{
                  width: LENS_SIZE,
                  height: LENS_SIZE,
                  left: mousePos.x - LENS_SIZE / 2,
                  top: mousePos.y - LENS_SIZE / 2,
                  backgroundImage: `url(${selected})`,
                  backgroundSize: `${mousePos.w * ZOOM_FACTOR}px ${mousePos.h * ZOOM_FACTOR}px`,
                  backgroundPosition: `-${mousePos.x * ZOOM_FACTOR - LENS_SIZE / 2}px -${mousePos.y * ZOOM_FACTOR - LENS_SIZE / 2}px`,
                  backgroundRepeat: 'no-repeat',
                  backgroundColor: 'var(--color-bg-secondary)',
                }}
              />
            )}
          </>
        ) : (
          <i
            className={`ti ${PLACEHOLDER_ICON} text-[120px] text-[var(--color-text-tertiary)]`}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  )
}
