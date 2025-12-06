import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaCalendarAlt, FaGlobeEurope, FaRegClock } from "react-icons/fa";

import { getLatestVenues } from "./api";
import type { Venue } from "./types";
import HeroCarousel from "../../components/HeroCarousel";

export default function Home() {
  const nav = useNavigate();
  const [query, setQuery] = useState("");

  // Hent 5 nyeste (API-rekkefølge + sort fallback på created om feltet finnes)
  const { data, isLoading, isError } = useQuery<Venue[]>({
    queryKey: ["featured-venues", "latest-5"],
    queryFn: () => getLatestVenues(5),
  });

  const featured = (data ?? []).slice().sort((a, b) => {
    const ca = a.created ?? "";
    const cb = b.created ?? "";
    // nyeste først hvis created finnes, ellers beholder rekkefølgen
    return cb.localeCompare(ca);
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      nav("/venues");
      return;
    }
    nav(`/venues?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="grid gap-8">
      {/* Hero carousel */}
      <div className="mx-auto w-full max-w-6xl px-4">
        {isLoading ? (
          <div className="h-[380px] w-full animate-pulse rounded-2xl border bg-gray-200 sm:h-[440px]" />
        ) : isError ? (
          <div className="rounded-2xl border bg-white p-4 text-sm text-red-600">
            Couldn’t load featured venues.
          </div>
        ) : (
          <HeroCarousel venues={featured} />
        )}
      </div>

      {/* Søk + promosnutten din */}
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="grid items-center gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
          <div className="space-y-6">
            <h1 className="text-3xl font-semibold md:text-4xl">
              Find your next stay with Holidaze
            </h1>
            <p className="max-w-xl text-gray-600">
              Browse unique venues across Norway and beyond. Whether you&apos;re planning a weekend
              getaway or a longer trip, we&apos;ve got you covered.
            </p>

            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-2 rounded-xl border bg-white p-3 shadow-sm sm:flex-row sm:items-center"
            >
              <input
                className="flex-1 rounded border px-3 py-2 text-sm"
                placeholder="Search by city, venue name, or keyword…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="submit"
                className="bg-brand-900 hover:bg-brand-800 cursor-pointer rounded px-4 py-2 text-sm font-medium text-white"
              >
                Search venues
              </button>
            </form>

            <div className="flex flex-wrap gap-3 text-sm text-gray-700">
              <span className="font-medium">Popular:</span>
              <button
                type="button"
                className="cursor-pointer rounded-full border bg-white px-3 py-1 hover:bg-gray-50"
                onClick={() => nav("/venues?q=bergen")}
              >
                Bergen
              </button>
              <button
                type="button"
                className="cursor-pointer rounded-full border bg-white px-3 py-1 hover:bg-gray-50"
                onClick={() => nav("/venues?q=oslo")}
              >
                Oslo
              </button>
              <button
                type="button"
                className="cursor-pointer rounded-full border bg-white px-3 py-1 hover:bg-gray-50"
                onClick={() => nav("/venues?q=vadsø")}
              >
                Vadsø
              </button>
              <button
                type="button"
                className="cursor-pointer rounded-full border bg-white px-3 py-1 hover:bg-gray-50"
                onClick={() => nav("/venues?q=trondheim")}
              >
                Trondheim
              </button>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="from-brand-100 relative h-64 w-full border overflow-hidden rounded-2xl bg-gradient-to-br via-brand-100 to-brand-300">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#ffffff,_transparent_55%)]" />

              <div className="relative flex h-full flex-col justify-between p-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Plan ahead
                  </p>
                  <p className="text-lg font-semibold text-gray-800">
                    Book early and never miss your perfect stay.
                  </p>
                  <p className="max-w-xs text-sm text-gray-700">
                    Choose your dates, filter by price and guests, and save your favourites for
                    later.
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-800">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="h-4 w-4" />
                    <span>Flexible date search</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaGlobeEurope className="h-4 w-4" />
                    <span>Stays across Norway and beyond</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaRegClock className="h-4 w-4" />
                    <span>Book in minutes</span>
                  </div>

                  <Link
                    to="/venues"
                    className="text-brand ml-auto inline-flex items-center rounded bg-white px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-gray-50"
                  >
                    Browse all venues
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
