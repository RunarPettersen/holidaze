import RatingStars from "./RatingStars";
import type { Venue } from "../features/venues/types";

type Props = {
  venue: Venue;
};

export default function HeaderBlock({ venue }: Props) {
  const addr = venue.location?.address ? `${venue.location.address}, ` : "";
  const city = venue.location?.city ?? "";
  const country = venue.location?.country ?? "";
  const rating = venue.rating ?? 0;

  return (
    <header className="grid gap-2 rounded-xl border bg-white p-4">
      <h1 className="text-3xl font-semibold">{venue.name}</h1>

      {/* Rating + address line */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <RatingStars value={rating} ariaLabel="Average rating" />
          <span className="tabular-nums">{rating.toFixed(1)}</span>
        </div>
        {(city || country || addr) && <span className="text-gray-400">•</span>}
        <p className="text-gray-600">
          {addr}
          {city}
          {city && country ? ", " : " "}
          {country}
        </p>
      </div>

      {venue.description && (
        <p className="text-gray-800">{venue.description}</p>
      )}

      <p className="text-sm">
        Max {venue.maxGuests} guests •{" "}
        <span className="font-medium">{venue.price}</span> NOK / night
      </p>
    </header>
  );
}