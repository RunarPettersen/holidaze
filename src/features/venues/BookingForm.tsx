import { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createBooking } from "../bookings/api";
import { fmt } from "../../lib/date";
import { useAuth } from "../auth/AuthContext";
import type { Booking } from "../bookings/types";
import type { ExistingBooking } from "./bookingTypes";
import {
  addDays,
  hasOverlappingBooking,
  isInvalidRange,
  getMyUpcomingBookings,
} from "./bookingUtils";

type Props = {
  venueId: string;
  maxGuests: number;
  existing: ExistingBooking[];
};

/**
 * Booking form for a single venue.
 *
 * Handles:
 * - date range selection with minimum 1 night
 * - guest count and validation
 * - overlap detection against existing bookings
 * - displaying the user's own upcoming bookings on this venue
 * - creating a booking via the Noroff Holidaze API
 */
export default function BookingForm({
  venueId,
  maxGuests,
  existing = [],
}: Props) {
  const { user } = useAuth();
  const userName = user?.name ?? "";
  const qc = useQueryClient();

  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = addDays(today, 1);

  const [dateFrom, setDateFrom] = useState(today);
  const [dateTo, setDateTo] = useState(tomorrow);
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null); // shows success banner

  // Derived state
  const hasOverlap = useMemo(
    () => hasOverlappingBooking(dateFrom, dateTo, existing),
    [dateFrom, dateTo, existing],
  );

  const invalidRange = useMemo(
    () => isInvalidRange(dateFrom, dateTo),
    [dateFrom, dateTo],
  );

  const myUpcomingBookings = useMemo(
    () => getMyUpcomingBookings(existing, userName, today),
    [existing, userName, today],
  );

  const mutation = useMutation<Booking, unknown, void>({
    mutationFn: () => createBooking({ venueId, dateFrom, dateTo, guests }),
    onSuccess: (newBooking) => {
      setOk("Booking confirmed!");
      setError(null);

      if (userName) {
        // Optimistic update of "My bookings"
        qc.setQueryData<Booking[]>(["my-bookings", userName], (old) =>
          old ? [...old, newBooking] : [newBooking],
        );

        // Re-fetch to keep everything in sync (including header count)
        qc.invalidateQueries({ queryKey: ["my-bookings", userName] });
        qc.invalidateQueries({ queryKey: ["my-bookings-count", userName] });
      }

      // Refresh venue details (bookings / availability)
      qc.invalidateQueries({ queryKey: ["venue", venueId] });

      // Reset form
      setDateFrom(today);
      setDateTo(tomorrow);
      setGuests(1);
    },
    onError: (err: unknown) => {
      setOk(null);
      const message =
        err instanceof Error ? err.message : "Could not create booking";
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

  // If user changes any input, hide the success banner so UI reflects the new state
  const clearOk = () => ok && setOk(null);

  // min check-out date: at least 1 day after check-in
  const minToDate = dateFrom ? addDays(dateFrom, 1) : addDays(today, 1);

  return (
    <div className="bg-white grid gap-3 rounded-xl border p-4">
      <h2 className="text-lg font-semibold">Book this venue</h2>

      {!user && (
        <p className="text-sm text-gray-600">Log in to make a booking.</p>
      )}
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

              // If "to" falls before/same as new "from", bump it by one day
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

      {/* Info about the user's own bookings on this venue */}
      {user && myUpcomingBookings.length > 0 && (
        <div className="mt-1 text-xs text-gray-700">
          {myUpcomingBookings.length === 1 ? (
            <p>
              You have booked this from{" "}
              {fmt(myUpcomingBookings[0].dateFrom)} to{" "}
              {fmt(myUpcomingBookings[0].dateTo)}.
            </p>
          ) : (
            <>
              <p className="mb-1 font-medium">
                You have upcoming bookings for this venue:
              </p>
              <ul className="list-disc space-y-0.5 pl-4">
                {myUpcomingBookings.map((b, i) => (
                  <li key={`${b.dateFrom}-${b.dateTo}-${i}`}>
                    {fmt(b.dateFrom)} – {fmt(b.dateTo)}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {/* Validation messages */}
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