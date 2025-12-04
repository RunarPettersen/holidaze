import type { VenueFormValues } from "./VenueForm";

type Props = {
  values: VenueFormValues;
  update: <K extends keyof VenueFormValues>(
    key: K,
    value: VenueFormValues[K],
  ) => void;
  maxPrice: number;
  labelCls: string;
  inputCls: string;
};

export default function BasicInfoFields({
  values,
  update,
  maxPrice,
  labelCls,
  inputCls,
}: Props) {
  const numericPrice = Number(values.price) || 0;
  const priceTooHigh = numericPrice > maxPrice;

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <label className="block sm:col-span-3">
        <span className={labelCls}>Name</span>
        <input
          className={inputCls}
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className={labelCls}>
          Price (NOK / night, max {maxPrice.toLocaleString("nb-NO")})
        </span>
        <input
          type="number"
          min={0}
          max={maxPrice}
          className={inputCls}
          value={values.price}
          onChange={(e) => update("price", e.target.value)}
          required
        />
        <div className="mt-1 text-xs">
          <p className="text-ink/60">
            Maximum allowed price is {maxPrice.toLocaleString("nb-NO")} NOK per
            night (API limit).
          </p>
          {priceTooHigh && (
            <p className="text-red-600">
              Price is higher than {maxPrice.toLocaleString("nb-NO")} NOK. The
              API will reject this value, please lower the price.
            </p>
          )}
        </div>
      </label>

      <label className="block">
        <span className={labelCls}>Max guests</span>
        <input
          type="number"
          min={1}
          className={inputCls}
          value={values.maxGuests}
          onChange={(e) => update("maxGuests", e.target.value)}
          required
        />
      </label>

      <label className="block">
        <span className={labelCls}>Rating (0–5)</span>
        <input
          type="number"
          min={0}
          max={5}
          step={0.1}
          className={inputCls}
          value={values.rating}
          onChange={(e) => update("rating", e.target.value)}
          placeholder="e.g. 4.5"
        />
      </label>

      <label className="block sm:col-span-3">
        <span className={labelCls}>Description</span>
        <textarea
          className={`${inputCls} min-h-[120px]`}
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          rows={4}
        />
      </label>
    </div>
  );
}