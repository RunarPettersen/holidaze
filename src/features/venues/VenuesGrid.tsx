import { Link } from "react-router-dom";
import type { Venue } from "./types";

type VenuesGridProps = {
  items: Venue[];
};

export default function VenuesGrid({ items }: VenuesGridProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((v) => (
        <li
          key={v.id}
          className="flex flex-col overflow-hidden rounded-xl border"
        >
          <Link to={`/venues/${v.id}`} className="block">
            <div className="aspect-[16/10] bg-gray-100">
              {v.media?.[0]?.url && (
                <img
                  src={v.media[0].url}
                  alt={v.media[0].alt ?? v.name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </Link>

          <div className="flex flex-1 flex-col gap-2 p-4 text-sm bg-white">
            <div>
              <h2 className="text-base font-semibold">{v.name}</h2>
              <p className="text-gray-600">
                {v.location?.city ?? ""}
                {v.location?.city && v.location?.country ? ", " : ""}
                {v.location?.country ?? ""}
              </p>
            </div>

            <p>
              Max {v.maxGuests} guests •{" "}
              <span className="font-medium">{v.price}</span> NOK / night
            </p>

            <div className="mt-auto flex justify-between text-xs text-gray-600">
              <span>
                {v.meta?.wifi && "Wi-Fi "}
                {v.meta?.parking && "Parking "}
                {v.meta?.breakfast && "Breakfast "}
                {v.meta?.pets && "Pets allowed "}
              </span>
              {typeof v.rating === "number" && v.rating > 0 && (
                <span>★ {v.rating.toFixed(1)}</span>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}