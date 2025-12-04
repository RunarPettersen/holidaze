import { api } from "../../lib/api";
import type {
  Venue,
  VenueLocation,
  VenueMedia,
  VenueMeta,
} from "./types";

export type VenueBooking = {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
  customer?: {
    name?: string;
    email?: string;
  };
};

export async function getVenues(params?: { page?: number; limit?: number; q?: string }) {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20; // størrelse per side

  const q = params?.q?.trim();
  if (q) {
    // use API search endpoint
    return api<Venue[]>("/holidaze/venues/search", {
      query: { q, page, limit },
    });
  }

  // default listing
  return api<Venue[]>("/holidaze/venues", {
    query: { page, limit },
  });
}

export async function getAllVenues(params?: { q?: string }) {
  const limit = 100;
  const q = params?.q?.trim();
  let page = 1;
  const all: Venue[] = [];

  while (true) {
    const pageData = await getVenues({
      page,
      limit,
      q: q || undefined,
    });

    all.push(...pageData);

    if (pageData.length < limit) break; // ingen flere sider
    page++;
  }

  return all;
}

export async function getLatestVenues(take = 5, params?: { q?: string }) {
  // henter opptil 100 (din getAllVenues gjør paginering)
  const all = await getAllVenues({ q: params?.q });

  const sorted = all.slice().sort((a, b) => {
    const ad =
      (a.created ? Date.parse(a.created) : 0) ||
      (a.updated ? Date.parse(a.updated) : 0) ||
      0;
    const bd =
      (b.created ? Date.parse(b.created) : 0) ||
      (b.updated ? Date.parse(b.updated) : 0) ||
      0;

    // nyeste først; fallback hvis begge = 0: navn desc for å unngå “Z-bias”
    if (bd !== ad) return bd - ad;
    return (b.name || "").localeCompare(a.name || "");
  });

  return sorted.slice(0, take);
}

export async function getVenueById(id: string) {
  return api<Venue & { bookings?: VenueBooking[] }>(
    `/holidaze/venues/${id}`,
    { query: { _bookings: true } }
  );
}

export async function getManagedVenues(profileName: string) {
  return api<Venue[]>(
    `/holidaze/profiles/${encodeURIComponent(profileName)}/venues`
  );
}

export type VenuePayload = {
  name: string;
  description: string;
  price: number;
  maxGuests: number;
  media: VenueMedia[];
  meta?: VenueMeta;
  location?: VenueLocation;
  rating?: number;
};

export async function createVenue(payload: VenuePayload) {
  return api<Venue>("/holidaze/venues", {
    method: "POST",
    body: payload,
  });
}

export async function updateVenue(id: string, payload: VenuePayload) {
  return api<Venue>(`/holidaze/venues/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export async function deleteVenue(id: string) {
  return api<void>(`/holidaze/venues/${id}`, {
    method: "DELETE",
  });
}