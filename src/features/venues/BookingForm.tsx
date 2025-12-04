import { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking } from "../bookings/api";
import { overlaps } from "../../lib/date";
import { useAuth } from "../auth/AuthContext";
import type { Booking } from "../bookings/types";

type ExistingBooking = { dateFrom: string; dateTo: string };

// helper: add days to an ISO date string (YYYY-MM-DD)
function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function BookingForm({
  venueId,
  maxGuests,
  existing = [],
}: {
  venueId: string;
  maxGuests: number;
  existing: ExistingBooking[];
}) {
  const { user } = useAuth();
  const name = user?.name ?? "";
  const qc = useQueryClient();

  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = addDays(today, 1);

  const [dateFrom, setDateFrom] = useState(today);
  const [dateTo, setDateTo] = useState(tomorrow);
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null); // shows success banner

  const hasOverlap = useMemo(() => {
    if (!dateFrom || !dateTo) return false;
    return existing.some((b) => overlaps(dateFrom, dateTo, b.dateFrom, b.dateTo));
  }, [dateFrom, dateTo, existing]);

  // check-out must be after check-in
  const invalidRange =
    dateFrom && dateTo ? new Date(dateTo) <= new Date(dateFrom) : false;

  const mutation = useMutation<Booking, unknown, void>({
    mutationFn: () => createBooking({ venueId, dateFrom, dateTo, guests }),
    onSuccess: (newBooking) => {
      setOk("Booking confirmed!");
      setError(null);

      // Update my bookings + header
      if (name) {
        // Optimistic update so the count increases immediately
        qc.setQueryData<Booking[]>(["my-bookings", name], (old) =>
          old ? [...old, newBooking] : [newBooking]
        );

        // Refetch to stay in sync with the server
        qc.invalidateQueries({ queryKey: ["my-bookings", name] });
      }

      // Refresh venue details (e.g. available dates)
      qc.invalidateQueries({ queryKey: ["venue", venueId] });

      // Reset form so “overlap” doesn't show with the just-booked dates
      setDateFrom(today);
      setDateTo(tomorrow);
      setGuests(1);
    },
    onError: (err: unknown) => {
      setOk(null);
      const message = err instanceof Error ? err.message : "Could not create booking";
      setError(message);
    },
  });

  const disabled =
    !user ||
    !dateFrom ||
    !dateTo ||
    invalidRange ||
    guests < 1 ||
    guests > maxGuests ||
    hasOverlap;

  // If user changes any input, hide the success banner so the UI reflects the new state
  const clearOk = () => ok && setOk(null);

  // min check-out date: at least 1 day after check-in
  const minToDate = dateFrom ? addDays(dateFrom, 1) : addDays(today, 1);

  return (
    <div className="bg-white grid gap-3 rounded-xl border p-4">
      <h2 className="text-lg font-semibold">Book this venue</h2>

      {!user && <p className="text-sm text-gray-600">Log in to make a booking.</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {ok && <p className="text-sm text-green-700">{ok}</p>}

      <div className="grid gap-2 sm:grid-cols-3">
        <label className="grid gap-1">
          <span className="text-sm">From</span>
          <input
            type="date"
            className="rounded border px-3 py-2"
            value={dateFrom}
            onChange={(e) => {
              clearOk();
              const newFrom = e.target.value;
              setDateFrom(newFrom);

              // If current "to" is before or same as new "from", push it to the next day
              setDateTo((prev) => {
                if (!prev) return addDays(newFrom, 1);
                if (new Date(prev) <= new Date(newFrom)) {
                  return addDays(newFrom, 1);
                }
                return prev;
              });
            }}
            min={today}
          />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">To</span>
          <input
            type="date"
            className="rounded border px-3 py-2"
            value={dateTo}
            onChange={(e) => {
              clearOk();
              setDateTo(e.target.value);
            }}
            min={minToDate}
          />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Guests (max {maxGuests})</span>
          <input
            type="number"
            className="rounded border px-3 py-2"
            value={guests}
            min={1}
            max={maxGuests}
            onChange={(e) => {
              clearOk();
              setGuests(Number(e.target.value));
            }}
          />
        </label>
      </div>

      {/* Show warnings */}
      {dateFrom && dateTo && !ok && invalidRange && (
        <p className="text-sm text-red-600">
          Check-out date must be after check-in date.
        </p>
      )}

      {dateFrom && dateTo && !ok && !invalidRange && hasOverlap && (
        <p className="text-sm text-red-600">
          Selected dates overlap with an existing booking.
        </p>
      )}

      <div>
        <button
          className={`bg-brand-900 hover:bg-brand-800 cursor-pointer rounded px-4 py-2 text-white ${
            disabled ? "bg-gray-400" : "bg-brand"
          }`}
          disabled={disabled || mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? "Booking…" : "Book now"}
        </button>
      </div>
    </div>
  );
}