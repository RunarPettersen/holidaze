import { Link } from "react-router-dom";
import type { Booking } from "./types";
import { fmt, isUpcoming } from "../../lib/date";

type Props = {
  booking: Booking;
  onCancelClick?: (id: string) => void;
  cancelPending?: boolean;
};

export default function BookingCard({ booking, onCancelClick, cancelPending }: Props) {
  const v = booking.venue;
  const cover = v?.media?.[0];

  return (
    <li className="rounded-xl border overflow-hidden flex flex-col">
      <Link to={`/venues/${v?.id ?? ""}`} className="block">
        <div className="aspect-[16/10] bg-gray-100">
          {cover?.url && (
            <img
              src={cover.url}
              alt={cover.alt ?? v?.name ?? "Venue"}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </Link>

      <div className="p-4 flex-1 flex flex-col gap-2 bg-white">
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
              className="rounded border px-3 py-1 text-red-600 cursor-pointer hover:bg-red-50 disabled:opacity-50"
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