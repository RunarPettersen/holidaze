import { Link } from "react-router-dom";
import type { Booking } from "./types";
import { fmt, isUpcoming } from "../../lib/date";

type Props = {
  booking: Booking;
  onCancelClick?: (id: string) => void;
  cancelPending?: boolean;
};

/**
 * Card component for a single booking in the “My bookings” list.
 * Shows venue image, basic info and an optional cancel button
 * for upcoming stays.
 */
export default function BookingCard({ booking, onCancelClick, cancelPending }: Props) {
  const v = booking.venue;
  const cover = v?.media?.[0];

  // Use venue image if available, otherwise a generic placeholder
  const coverUrl = cover?.url || "/images/noimage.jpg";
  const coverAlt = cover?.alt ?? v?.name ?? "Venue image";

  return (
    <li className="flex flex-col overflow-hidden rounded-xl border">
      <Link to={`/venues/${v?.id ?? ""}`} className="block">
        <div className="aspect-[16/10] bg-gray-100">
          <img
            src={coverUrl}
            alt={coverAlt}
            className="h-full w-full object-cover"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 bg-white p-4">
        <div>
          <h3 className="font-semibold">{v?.name ?? "Unknown place"}</h3>
          <p className="text-sm text-gray-600">
            {fmt(booking.dateFrom)} – {fmt(booking.dateTo)} • {booking.guests} guests
          </p>
          <p className="text-sm text-gray-600">
            {v?.location?.city ?? ""} {v?.location?.country ?? ""}
          </p>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2 text-sm">
          {typeof v?.price === "number" && <p>Approx. {v.price} NOK / night</p>}

          {isUpcoming(booking.dateTo) && onCancelClick && (
            <button
              className="cursor-pointer rounded border px-3 py-1 text-red-600 hover:bg-red-50 disabled:opacity-50"
              disabled={!!cancelPending}
              onClick={() => onCancelClick(booking.id)}
            >
              {cancelPending ? "Cancelling…" : "Cancel"}
            </button>
          )}
        </div>
      </div>
    </li>
  );
}