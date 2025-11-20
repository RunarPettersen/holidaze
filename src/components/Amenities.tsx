import type { VenueMeta } from "../features/venues/types";

type Props = { meta?: VenueMeta };

export default function Amenities({ meta }: Props) {
  const items = [
    { key: "wifi" as const, label: "Wi-Fi" },
    { key: "parking" as const, label: "Parking" },
    { key: "breakfast" as const, label: "Breakfast" },
    { key: "pets" as const, label: "Pets allowed" },
  ];

  const shown = items.filter((i) => meta?.[i.key]);
  const hasAny = shown.length > 0;

  return (
    <section className="rounded-xl border bg-white p-4">
      <h3 className="mb-2 text-base font-semibold">Amenities</h3>
      {hasAny ? (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {shown.map(({ key, label }) => (
            <li key={key} className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" className="text-brand-900" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{label}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-600">No amenities listed.</p>
      )}
    </section>
  );
}