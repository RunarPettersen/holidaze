import type { VenueFormValues } from "./VenueForm";

type Props = {
  values: VenueFormValues;
  update: <K extends keyof VenueFormValues>(
    key: K,
    value: VenueFormValues[K],
  ) => void;
  labelCls: string;
  inputCls: string;
};

export default function LocationFields({
  values,
  update,
  labelCls,
  inputCls,
}: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <label className="block">
        <span className={labelCls}>Address</span>
        <input
          className={inputCls}
          value={values.address || ""}
          onChange={(e) => update("address", e.target.value)}
        />
      </label>
      <label className="block">
        <span className={labelCls}>City</span>
        <input
          className={inputCls}
          value={values.city || ""}
          onChange={(e) => update("city", e.target.value)}
        />
      </label>
      <label className="block">
        <span className={labelCls}>Country</span>
        <input
          className={inputCls}
          value={values.country || ""}
          onChange={(e) => update("country", e.target.value)}
        />
      </label>
    </div>
  );
}