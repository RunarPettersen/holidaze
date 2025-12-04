type VenuesPaginationProps = {
  page: number;
  total: number;
  pageSize: number;
  currentCount: number;
  hasNextPage: boolean;
  isLoading: boolean;
  onPageChange: (page: number) => void;
};

export default function VenuesPagination({
  page,
  total,
  pageSize,
  currentCount,
  hasNextPage,
  isLoading,
  onPageChange,
}: VenuesPaginationProps) {
  if (total === 0) return null;

  // Første og siste element på denne siden (1-basert)
  const firstItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = currentCount === 0 ? 0 : firstItem + currentCount - 1;

  const showingText =
    total > 0
      ? ` • Showing ${firstItem}-${lastItem} of ${total} venues`
      : "";

  const canGoPrev = page > 1 && !isLoading;
  const canGoNext = hasNextPage && !isLoading;

  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <span className="text-gray-600">
        Page {page}
        {showingText}
      </span>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!canGoPrev}
          className="rounded border px-3 py-1 bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!canGoNext}
          className="rounded border px-3 py-1 bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}