import type { VenueMeta } from "../features/venues/types";
import type { IconType } from "react-icons";
import { FiWifi } from "react-icons/fi";
import { MdOutlineLocalParking, MdOutlineFreeBreakfast, MdPets } from "react-icons/md";

type Props = {
  meta?: VenueMeta;
};

const AMENITIES: { key: keyof VenueMeta; label: string; Icon: IconType }[] = [
  { key: "wifi",      label: "Wi-Fi",        Icon: FiWifi },
  { key: "parking",   label: "Parking",      Icon: MdOutlineLocalParking },
  { key: "breakfast", label: "Breakfast",    Icon: MdOutlineFreeBreakfast },
  { key: "pets",      label: "Pets allowed", Icon: MdPets },
];

export default function Amenities({ meta }: Props) {
  if (!meta) return null;

  const enabled = AMENITIES.filter((item) => meta[item.key]);

  if (enabled.length === 0) return null;

  return (
    <section className="rounded-2xl border bg-white p-4 sm:p-6">
      <h2 className="mb-3 text-lg font-semibold text-ink">Amenities</h2>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {enabled.map(({ key, label, Icon }) => (
          <li
            key={key}
            className="flex items-center gap-2 text-sm text-gray-800"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full">
              <Icon className="h-4 w-4" />
            </span>
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}