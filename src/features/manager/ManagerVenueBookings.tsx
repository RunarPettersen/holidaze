import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getVenueById, type VenueBooking } from "../venues/api";
import type { Venue } from "../venues/types";
import { fmt, isUpcoming } from "../../lib/date";

type VenueWithBookings = Venue & {
  bookings?: VenueBooking[];
};

export default function ManagerVenueBookings() {
  const { id = "" } = useParams();

  const { data, isLoading, isError, error } = useQuery<VenueWithBookings>({
    queryKey: ["venue-bookings", id],
    queryFn: () => getVenueById(id),
    enabled: !!id,
  });

  if (isLoading) return <p>Loading bookings…</p>;

  if (isError || !data) {
    const message =
      (error as Error | undefined)?.message ?? "Not found";
    return <p className="text-red-600">Error: {message}</p>;
  }

  const upcoming =
    (data.bookings ?? [])
      .filter((b) => isUpcoming(b.dateTo))
      .sort(
        (a, b) =>
          new Date(a.dateFrom).getTime() -
          new Date(b.dateFrom).getTime()
      );

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Bookings – {data.name}
          </h1>
          <p className="text-sm text-gray-600">
            Upcoming bookings for this venue.
          </p>
        </div>

        <Link
          to="/manager/venues"
          className="text-sm text-brand hover:underline"
        >
          ← Back to My venues
        </Link>
      </div>

      {upcoming.length === 0 ? (
        <p>No upcoming bookings for this venue.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-2">Dates</th>
                <th className="px-4 py-2">Guests</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Booked at</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="px-4 py-2">
                    {fmt(b.dateFrom)} – {fmt(b.dateTo)}
                  </td>
                  <td className="px-4 py-2">{b.guests}</td>
                  <td className="px-4 py-2">
                    {b.customer?.name ?? "Unknown"}
                    {b.customer?.email && (
                      <span className="text-gray-500">
                        {" "}
                        ({b.customer.email})
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {fmt(b.created)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}