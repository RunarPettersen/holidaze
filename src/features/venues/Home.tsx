import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();
  const [query, setQuery] = useState("");

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
    <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] items-center">
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold md:text-4xl">
          Find your next stay with Holidaze
        </h1>
        <p className="text-gray-600 max-w-xl">
          Browse unique venues across Norway and beyond. Whether you&apos;re
          planning a weekend getaway or a longer trip, we&apos;ve got you
          covered.
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
            className="rounded bg-brand px-4 py-2 text-sm font-medium text-white"
          >
            Search venues
          </button>
        </form>

        <div className="flex flex-wrap gap-3 text-sm text-gray-700">
          <span className="font-medium">Popular:</span>
          <button
            type="button"
            className="bg-white cursor-pointer rounded-full border px-3 py-1 hover:bg-gray-50"
            onClick={() => nav("/venues?q=bergen")}
          >
            Bergen
          </button>
          <button
            type="button"
            className="bg-white cursor-pointer rounded-full border px-3 py-1 hover:bg-gray-50"
            onClick={() => nav("/venues?q=oslo")}
          >
            Oslo
          </button>
          <button
            type="button"
            className="bg-white cursor-pointer rounded-full border px-3 py-1 hover:bg-gray-50"
            onClick={() => nav("/venues?q=mountain")}
          >
            Mountain cabins
          </button>
        </div>
      </div>

      <div className="hidden md:block">
        <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-brand/10 via-blue-100 to-emerald-100">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#ffffff,_transparent_50%)]" />
          <div className="absolute bottom-6 left-6 space-y-2">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Plan ahead
            </p>
            <p className="text-lg font-semibold text-gray-800">
              Book early and never miss your perfect stay.
            </p>
            <Link
              to="/venues"
              className="inline-flex rounded bg-white px-3 py-1 text-xs font-medium text-brand shadow-sm"
            >
              Browse all venues
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}