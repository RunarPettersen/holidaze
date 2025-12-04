import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Venue } from "../features/venues/types";

type Props = {
  venues: Venue[];
  intervalMs?: number; // auto-advance, default 6000
};

export default function HeroCarousel({ venues, intervalMs = 6000 }: Props) {
  const [idx, setIdx] = useState(0);
  const timer = useRef<number | null>(null);

  const count = venues.length;

  const goTo = useCallback(
    (i: number) => {
      if (count === 0) return;
      setIdx((i + count) % count);
    },
    [count]
  );

  const next = useCallback(() => {
    goTo(idx + 1);
  }, [goTo, idx]);

  const prev = useCallback(() => {
    goTo(idx - 1);
  }, [goTo, idx]);

  // auto-play (pause on hover/focus)
  useEffect(() => {
    if (count < 2) return;

    // rydde opp eventuell gammel timer
    if (timer.current) window.clearTimeout(timer.current);

    timer.current = window.setTimeout(next, intervalMs);

    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [count, intervalMs, next]); // next er nå stabil (useCallback), så lint er fornøyd

  if (count === 0) return null;

  return (
    <section
      className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border bg-white"
      aria-roledescription="carousel"
      aria-label="Featured venues"
    >
      {/* Slides wrapper */}
      <div
        className="relative h-[380px] sm:h-[440px]"
        onMouseEnter={() => {
          if (timer.current) window.clearTimeout(timer.current);
        }}
        onMouseLeave={() => {
          // resume immediately on leave
          timer.current = window.setTimeout(next, intervalMs);
        }}
      >
        {venues.map((v, i) => {
          const active = i === idx;
          const cover = v.media?.[0]?.url ?? "";
          const alt = v.media?.[0]?.alt ?? v.name;

          return (
            <div
              key={v.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                active ? "opacity-100" : "opacity-0"
              }`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
            >
              {/* image */}
              <div className="absolute inset-0">
                {cover ? (
                  <img
                    src={cover}
                    alt={alt}
                    className="h-full w-full object-cover"
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>

              {/* content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                <h3 className="text-2xl font-semibold drop-shadow">{v.name}</h3>
                <p className="text-sm opacity-90">
                  {(v.location?.city ?? "")} {(v.location?.country ?? "")} • {v.price} NOK / night
                </p>
                <div className="mt-3">
                  <Link
                    to={`/venues/${v.id}`}
                    className="inline-block rounded bg-brand-900 px-4 py-2 text-white hover:bg-brand-800"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* Arrows */}
        {count > 1 && (
          <>
            <button
              aria-label="Previous"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/55"
            >
              ‹
            </button>
            <button
              aria-label="Next"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/55"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {count > 1 && (
        <div className="pointer-events-auto absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {venues.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2.5 w-2.5 rounded-full ${
                i === idx ? "bg-white" : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}