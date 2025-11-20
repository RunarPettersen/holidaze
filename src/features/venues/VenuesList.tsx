import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getAllVenues } from "./api";
import type { Venue } from "./types";
import VenuesFiltersBar, { type VenueSortKey } from "./VenuesFiltersBar";

const PAGE_SIZE = 20;

export default function VenuesList() {
  const [searchParams, setSearchParams] = useSearchParams();

  // --- Read values from URL ---
  const q = searchParams.get("q") ?? "";
  const minGuestsParam = searchParams.get("minGuests") ?? "";
  const maxPriceParam = searchParams.get("maxPrice") ?? "";
  const sortFromUrl = searchParams.get("sort") as VenueSortKey | null;
  const sortParam: VenueSortKey = sortFromUrl ?? "recommended";

  const pageFromUrl = Number(searchParams.get("page") ?? "1");
  const page = Number.isFinite(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;

  const minGuests = minGuestsParam ? Number(minGuestsParam) : undefined;
  const maxPrice = maxPriceParam ? Number(maxPriceParam) : undefined;

  // --- Fetch ALL venues for this search query ---
  const {
    data: allVenues,
    isLoading,
    isError,
    error,
  } = useQuery<Venue[]>({
    queryKey: ["venues-all", { q }],
    queryFn: () =>
      getAllVenues({
        q: q || undefined,
      }),
  });

  // --- Filter & sort GLOBALT ---
  const processed = useMemo(() => {
    let result = [...(allVenues ?? [])];

    // Min guests
    if (minGuests !== undefined && !Number.isNaN(minGuests)) {
      result = result.filter((v) => v.maxGuests >= minGuests);
    }

    // Max price
    if (maxPrice !== undefined && !Number.isNaN(maxPrice)) {
      result = result.filter((v) => v.price <= maxPrice);
    }

    // Sortering
    switch (sortParam) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.created).getTime() - new Date(a.created).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.created).getTime() - new Date(b.created).getTime()
        );
        break;
      case "recommended":
      default:
        // Recommended: høy rating først, deretter nyest
        result.sort((a, b) => {
          const ra = a.rating ?? 0;
          const rb = b.rating ?? 0;
          if (rb !== ra) return rb - ra; // rating desc
          return (
            new Date(b.created).getTime() - new Date(a.created).getTime()
          ); // nyest først
        });
        break;
    }

    return result;
  }, [allVenues, minGuests, maxPrice, sortParam]);

  // --- Derive current page slice ---
  const total = processed.length;
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const pageItems = processed.slice(startIndex, endIndex);

  const hasNextPage = endIndex < total;

  // --- Update URL helpers ---
  function handleApplyFilters(values: {
    q: string;
    minGuests: string;
    maxPrice: string;
    sort: VenueSortKey;
  }) {
    const params = new URLSearchParams();

    const qTrimmed = values.q.trim();
    if (qTrimmed) params.set("q", qTrimmed);

    if (values.minGuests.trim()) {
      params.set("minGuests", values.minGuests.trim());
    }
    if (values.maxPrice.trim()) {
      params.set("maxPrice", values.maxPrice.trim());
    }

    if (values.sort && values.sort !== "recommended") {
      params.set("sort", values.sort);
    }

    // reset page when filters endres
    params.set("page", "1");

    setSearchParams(params);
  }

  function handleClearFilters() {
    setSearchParams(new URLSearchParams());
  }

  function goToPage(newPage: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    setSearchParams(params);
  }

  const errorMessage =
    error instanceof Error ? error.message : "Something went wrong";

  return (
    <div className="grid gap-6">
      <header className="grid gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Venues</h1>
          <p className="text-sm text-gray-600">
            Browse and filter venues. Use search to find a specific place.
          </p>
        </div>

        <VenuesFiltersBar
          q={q}
          minGuests={minGuestsParam}
          maxPrice={maxPriceParam}
          sort={sortParam}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />
      </header>

      {isLoading && <p>Loading venues…</p>}

      {isError && (
        <p className="text-sm text-red-600">Error: {errorMessage}</p>
      )}

      {!isLoading && !isError && pageItems.length === 0 && (
        <p className="text-sm text-gray-700">
          No venues found with the current search and filters.
        </p>
      )}

      {!isLoading && !isError && pageItems.length > 0 && (
        <>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((v) => (
              <li
                key={v.id}
                className="flex flex-col overflow-hidden rounded-xl border"
              >
                <Link to={`/venues/${v.id}`} className="block">
                  <div className="aspect-[16/10] bg-gray-100">
                    {v.media?.[0]?.url && (
                      <img
                        src={v.media[0].url}
                        alt={v.media[0].alt ?? v.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                </Link>

                <div className="flex flex-1 flex-col gap-2 p-4 text-sm bg-white">
                  <div>
                    <h2 className="text-base font-semibold">{v.name}</h2>
                    <p className="text-gray-600">
                      {v.location?.city ?? ""}
                      {v.location?.city && v.location?.country ? ", " : ""}
                      {v.location?.country ?? ""}
                    </p>
                  </div>

                  <p>
                    Max {v.maxGuests} guests •{" "}
                    <span className="font-medium">{v.price}</span> NOK / night
                  </p>

                  <div className="mt-auto flex justify-between text-xs text-gray-600">
                    <span>
                      {v.meta?.wifi && "Wi-Fi "}
                      {v.meta?.parking && "Parking "}
                      {v.meta?.breakfast && "Breakfast "}
                      {v.meta?.pets && "Pets allowed "}
                    </span>
                    {typeof v.rating === "number" && v.rating > 0 && (
                      <span>★ {v.rating.toFixed(1)}</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Page {page}
              {total > 0 && ` • Showing ${pageItems.length} of ${total} venues`}
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1 || isLoading}
                className="rounded border px-3 py-1 bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => goToPage(page + 1)}
                disabled={!hasNextPage || isLoading}
                className="rounded border px-3 py-1 bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}