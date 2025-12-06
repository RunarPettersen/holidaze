import { overlaps } from "../../lib/date";
import type { ExistingBooking } from "./bookingTypes";

/**
 * Returns a YYYY-MM-DD date string that is `days` days after `dateStr`.
 *
 * @param dateStr ISO date string (YYYY-MM-DD)
 * @param days    Number of days to add (can be negative)
 */
export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * Checks whether the given date range overlaps any of the existing bookings.
 *
 * @param from      Start date (inclusive), ISO YYYY-MM-DD
 * @param to        End date (exclusive), ISO YYYY-MM-DD
 * @param existing  Existing bookings for this venue
 */
export function hasOverlappingBooking(
  from: string | null,
  to: string | null,
  existing: ExistingBooking[],
): boolean {
  if (!from || !to) return false;
  return existing.some((b) => overlaps(from, to, b.dateFrom, b.dateTo));
}

/**
 * Returns true if the selected range is invalid (i.e. check-out is not after check-in).
 *
 * @param from Start date (inclusive), ISO YYYY-MM-DD
 * @param to   End date (exclusive), ISO YYYY-MM-DD
 */
export function isInvalidRange(from: string | null, to: string | null): boolean {
  if (!from || !to) return false;
  return new Date(to) <= new Date(from);
}

/**
 * Filters out upcoming (or currently running) bookings that belong to the given user.
 *
 * @param existing  All bookings for this venue
 * @param userName  Name of the currently logged-in user
 * @param todayISO  Today's date in ISO YYYY-MM-DD format
 */
export function getMyUpcomingBookings(
  existing: ExistingBooking[],
  userName: string,
  todayISO: string,
): ExistingBooking[] {
  if (!userName) return [];

  const today = new Date(todayISO);

  return existing.filter((b) => {
    if (!b.customerName || b.customerName !== userName) return false;
    // Only show bookings that have not fully ended yet
    return new Date(b.dateTo) >= today;
  });
}