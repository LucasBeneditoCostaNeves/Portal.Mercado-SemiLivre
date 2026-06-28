'use client'

import Image from 'next/image'
import { useState } from 'react'

type Props = {
  photos: string[]
}

export default function ReviewPhotosGallery({ photos }: Props) {
  const [lightbox, setLightbox] = useState<string | null>(null)

  if (photos.length === 0) return null

  return (
    <>
      <div>
        <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-3">
          Opiniões com fotos
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo, i) => (
            <button
              key={i}
              onClick={() => setLightbox(photo)}
              className="relative shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:opacity-90 transition-opacity"
              aria-label={`Ver foto ${i + 1}`}
            >
              <Image
                src={photo}
                alt={`Foto de comprador ${i + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Foto ampliada"
        >
          <div className="relative max-w-2xl max-h-[80vh] w-full mx-4">
            <Image
              src={lightbox}
              alt="Foto de comprador ampliada"
              width={800}
              height={800}
              className="object-contain w-full h-full rounded-xl"
            />
          </div>
        </div>
      )}
    </>
  )
}
