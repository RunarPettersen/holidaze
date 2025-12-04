import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { getVenueById } from "./api";
import type { Venue } from "./types";
import BookingForm from "./BookingForm";

import Gallery from "../../components/Gallery";
import Amenities from "../../components/Amenities";
import HeaderBlock from "../../components/HeaderBlock";

type FullVenue = Venue & {
  bookings?: { dateFrom: string; dateTo: string }[];
};

export default function VenueDetail() {
  const { id = "" } = useParams();

  const { data, isLoading, isError, error } = useQuery<FullVenue>({
    queryKey: ["venue", id],
    queryFn: () => getVenueById(id),
    enabled: !!id,
  });

  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p className="text-red-600">Error: {(error as Error).message}</p>;
  if (!data) return <p>Venue not found.</p>;

  const images = data.media ?? [];
  const existing =
    data.bookings?.map((b) => ({ dateFrom: b.dateFrom, dateTo: b.dateTo })) ?? [];

  return (
    <article className="grid gap-6">
      <Gallery images={images} venueName={data.name} />
      <HeaderBlock venue={data} />
      <Amenities meta={data.meta} />

      {data.owner && (
        <section className="grid gap-2 rounded-xl border bg-white p-4">
          <h2 className="text-base font-semibold">Venue listed by</h2>
          <div className="mt-1 flex items-center gap-3 text-sm">
            {data.owner.avatar?.url && (
              <img
                src={data.owner.avatar.url}
                alt={data.owner.avatar.alt || data.owner.name}
                className="h-10 w-10 rounded-full object-cover border"
              />
            )}
            <div>
              <p className="font-medium">{data.owner.name}</p>
              {data.owner.email && (
                <p className="text-gray-600">{data.owner.email}</p>
              )}
            </div>
          </div>
        </section>
      )}

      <BookingForm venueId={data.id} maxGuests={data.maxGuests} existing={existing} />
    </article>
  );
}