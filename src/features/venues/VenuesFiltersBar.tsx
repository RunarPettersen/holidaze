import { useEffect, useState } from "react";

export type VenueSortKey =
  | "recommended"
  | "name-asc"
  | "name-desc"
  | "newest"
  | "oldest";

type Props = {
  q: string;
  minGuests: string;
  maxPrice: string;
  sort: VenueSortKey;
  onApply: (values: {
    q: string;
    minGuests: string;
    maxPrice: string;
    sort: VenueSortKey;
  }) => void;
  onClear: () => void;
};

export default function VenuesFiltersBar({
  q,
  minGuests,
  maxPrice,
  sort,
  onApply,
  onClear,
}: Props) {
  const [searchInput, setSearchInput] = useState(q);
  const [minGuestsInput, setMinGuestsInput] = useState(minGuests);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice);
  const [sortInput, setSortInput] = useState<VenueSortKey>(sort);

  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  useEffect(() => {
    setMinGuestsInput(minGuests);
  }, [minGuests]);

  useEffect(() => {
    setMaxPriceInput(maxPrice);
  }, [maxPrice]);

  useEffect(() => {
    setSortInput(sort);
  }, [sort]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onApply({
      q: searchInput,
      minGuests: minGuestsInput,
      maxPrice: maxPriceInput,
      sort: sortInput,
    });
  }

  function handleClear() {
    setSearchInput("");
    setMinGuestsInput("");
    setMaxPriceInput("");
    setSortInput("recommended");
    onClear();
  }

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as VenueSortKey;
    setSortInput(value);
    onApply({
      q: searchInput,
      minGuests: minGuestsInput,
      maxPrice: maxPriceInput,
      sort: value,
    });
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <form
          onSubmit={handleSubmit}
          className="grid flex-1 gap-2 rounded-lg border bg-white p-3 text-sm sm:grid-cols-4 sm:items-end"
        >
          <label className="grid gap-1 sm:col-span-2">
            <span className="font-medium">Search</span>
            <input
              className="rounded border px-3 py-2"
              placeholder="City, venue name…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </label>

          <label className="grid gap-1">
            <span className="font-medium">Min guests</span>
            <input
              type="number"
              min={1}
              className="rounded border px-3 py-2"
              value={minGuestsInput}
              onChange={(e) => setMinGuestsInput(e.target.value)}
            />
          </label>

          <label className="grid gap-1">
            <span className="font-medium">Max price (NOK)</span>
            <input
              type="number"
              min={0}
              className="rounded border px-3 py-2"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
            />
          </label>

          <div className="flex gap-2 sm:col-span-4">
            <button
              type="submit"
              className="bg-brand-900 hover:bg-brand-800 cursor-pointer rounded px-4 py-2 text-white"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="rounded border px-4 py-2 cursor-pointer"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
      <div>
        <label className="grid gap-1 text-sm sm:w-56">
          <span className="font-medium">Sort by</span>
          <select
            className="rounded border px-3 py-2 bg-white"
            value={sortInput}
            onChange={handleSortChange}
          >
            <option value="recommended">Recommended</option>
            <option value="name-asc">Name (A–Z)</option>
            <option value="name-desc">Name (Z–A)</option>
            <option value="newest">Newest → oldest</option>
            <option value="oldest">Oldest → newest</option>
          </select>
        </label>
      </div>
    </div>
  );
}