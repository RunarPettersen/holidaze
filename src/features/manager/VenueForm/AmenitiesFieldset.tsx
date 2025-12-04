import type { VenueFormValues } from "./VenueForm";

type Props = {
  values: VenueFormValues;
  update: <K extends keyof VenueFormValues>(
    key: K,
    value: VenueFormValues[K],
  ) => void;
  fieldsetCls: string;
};

export default function AmenitiesFieldset({
  values,
  update,
  fieldsetCls,
}: Props) {
  return (
    <fieldset className={fieldsetCls}>
      <legend className="text-base font-semibold text-ink">Amenities</legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-ink/30 text-brand-900 focus:ring-brand-300"
            checked={values.wifi}
            onChange={(e) => update("wifi", e.target.checked)}
          />
          <span className="text-sm text-ink/80">Wi-Fi</span>
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-ink/30 text-brand-900 focus:ring-brand-300"
            checked={values.parking}
            onChange={(e) => update("parking", e.target.checked)}
          />
          <span className="text-sm text-ink/80">Parking</span>
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-ink/30 text-brand-900 focus:ring-brand-300"
            checked={values.breakfast}
            onChange={(e) => update("breakfast", e.target.checked)}
          />
          <span className="text-sm text-ink/80">Breakfast</span>
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-ink/30 text-brand-900 focus:ring-brand-300"
            checked={values.pets}
            onChange={(e) => update("pets", e.target.checked)}
          />
          <span className="text-sm text-ink/80">Pets allowed</span>
        </label>
      </div>
    </fieldset>
  );
}