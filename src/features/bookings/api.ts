import { api } from "../../lib/api";
import type { Booking } from "./types";

export async function getMyBookings(profileName: string) {
  return api<Booking[]>(
    `/holidaze/profiles/${encodeURIComponent(profileName)}/bookings`,
    { query: { _venue: true, limit: 100 } }
  );
}

// NY: create booking
export async function createBooking(input: {
  venueId: string;
  dateFrom: string; // ISO (yyyy-mm-dd)
  dateTo: string;   // ISO
  guests: number;
}) {
  // Noroff expects: { dateFrom, dateTo, guests, venueId }
  return api<Booking>("/holidaze/bookings", { method: "POST", body: input });
}

export async function cancelBooking(id: string) {
  return api<Booking>(`/holidaze/bookings/${id}`, {
    method: "DELETE",
  });
}