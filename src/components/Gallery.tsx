import { useEffect, useMemo, useState } from "react";
import type { VenueMedia } from "../features/venues/types";

type Props = {
  images: VenueMedia[];
  venueName: string;
};

export default function Gallery({ images: rawImages, venueName }: Props) {
  const images = useMemo(() => rawImages.filter((m) => m?.url), [rawImages]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (current >= images.length) setCurrent(0);
  }, [images, current]);

  const hasImages = images.length > 0;
  const main = hasImages ? images[current] : undefined;

  function prev() {
    if (images.length < 2) return;
    setCurrent((i) => (i - 1 + images.length) % images.length);
  }
  function next() {
    if (images.length < 2) return;
    setCurrent((i) => (i + 1) % images.length);
  }

  return (
    <section className="grid gap-3">
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-gray-100 border">
        {main?.url ? (
          <img
            key={main.url}
            src={main.url}
            alt={main.alt ?? venueName}
            className="h-full w-full object-cover"
            onClick={next}
            role="button"
            aria-label="Next image"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            No image available
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={img.url + idx}
              type="button"
              onClick={() => setCurrent(idx)}
              className={`relative h-16 w-28 shrink-0 overflow-hidden rounded border ${
                idx === current ? "ring-2 ring-black" : "hover:opacity-90 cursor-pointer"
              }`}
              aria-label={`Show image ${idx + 1}`}
            >
              <img
                src={img.url}
                alt={img.alt ?? `${venueName} photo ${idx + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}