import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface ProductImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
}

export default function ProductImageCarousel({
  images,
  alt,
  className = '',
}: ProductImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images.length) {
    return (
      <div className={`bg-slate-100 border border-slate-100 rounded-xl overflow-hidden flex items-center justify-center ${className}`}>
        <ImageIcon className="h-8 w-8 text-slate-400" />
      </div>
    );
  }

  const safeIndex = Math.min(activeIndex, images.length - 1);
  const hasMultiple = images.length > 1;

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className={`relative bg-slate-100 border border-slate-100 rounded-xl overflow-hidden group ${className}`}>
      <img
        src={images[safeIndex]}
        alt={`${alt} - image ${safeIndex + 1}`}
        className="h-full w-full object-cover"
        referrerPolicy="no-referrer"
      />

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={goToPrevious}
            aria-label="Image précédente"
            className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-white/90 border border-slate-200 text-slate-700 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={goToNext}
            aria-label="Image suivante"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-white/90 border border-slate-200 text-slate-700 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Afficher l'image ${index + 1}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  index === safeIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                }`}
              />
            ))}
          </div>

          <span className="absolute top-2 right-2 text-[9px] font-mono font-bold bg-slate-900/70 text-white px-1.5 py-0.5 rounded-md">
            {safeIndex + 1}/{images.length}
          </span>
        </>
      )}
    </div>
  );
}
