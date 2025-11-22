import type { Booking } from "./types";
import { isUpcoming, isPast } from "../../lib/date";

export function partitionBookings(all: Booking[]) {
  const upcoming = all.filter((b) => isUpcoming(b.dateTo));
  const past = all.filter((b) => isPast(b.dateTo));
  return { upcoming, past, all };
}