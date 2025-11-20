import { useState } from "react";

export type VenueFormValues = {
  name: string;
  description: string;
  price: number | string;
  maxGuests: number | string;
  rating: string; // NEW: keep as string in the form
  media: { url: string; alt?: string }[];
  address?: string;
  city?: string;
  country?: string;
  wifi: boolean;
  parking: boolean;
  breakfast: boolean;
  pets: boolean;
};

type Props = {
  initialValues?: Partial<VenueFormValues>;
  submitLabel: string;
  submitting?: boolean;
  onSubmit: (values: VenueFormValues) => void;
};

const defaultValues: VenueFormValues = {
  name: "",
  description: "",
  price: "",
  maxGuests: "",
  rating: "", // NEW
  media: [{ url: "", alt: "" }], // start with one row
  address: "",
  city: "",
  country: "",
  wifi: false,
  parking: false,
  breakfast: false,
  pets: false,
};

export default function VenueForm({
  initialValues,
  submitLabel,
  submitting,
  onSubmit,
}: Props) {
  // tiny style tokens
  const labelCls = "block text-sm font-medium text-ink/80 mb-1";
  const inputCls =
    "w-full rounded border border-ink/20 bg-white/70 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-300";
  const fieldsetCls = "grid gap-2 rounded-xl border border-ink/20 bg-white/60 p-4";
  const btnSecondary =
    "rounded border border-ink/20 bg-white px-3 py-2 text-sm hover:bg-white/80 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const btnPrimary =
    "bg-brand-900 hover:bg-brand-800 text-white rounded px-4 py-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const [values, setValues] = useState<VenueFormValues>({
    ...defaultValues,
    ...initialValues,
    media:
      initialValues?.media && initialValues.media.length > 0
        ? initialValues.media.map((m) => ({ url: m.url || "", alt: m.alt || "" }))
        : defaultValues.media,
    // ensure rating is a string
    rating:
      typeof initialValues?.rating === "number"
        ? String(initialValues.rating)
        : initialValues?.rating ?? "",
  });

  function update<K extends keyof VenueFormValues>(key: K, val: VenueFormValues[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  function updateMedia(idx: number, key: "url" | "alt", val: string) {
    setValues((v) => {
      const media = [...v.media];
      media[idx] = { ...media[idx], [key]: val };
      return { ...v, media };
    });
  }

  function addImage() {
    setValues((v) => ({ ...v, media: [...v.media, { url: "", alt: "" }] }));
  }

  function removeImage(idx: number) {
    setValues((v) => {
      const media = v.media.filter((_, i) => i !== idx);
      return { ...v, media: media.length ? media : [{ url: "", alt: "" }] };
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      {/* Basic info */}
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
          <span className={labelCls}>Price (NOK / night)</span>
          <input
            type="number"
            min={0}
            className={inputCls}
            value={values.price}
            onChange={(e) => update("price", e.target.value)}
            required
          />
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

      {/* Images */}
      <section className={fieldsetCls}>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-ink">Images</h3>
          <button type="button" className={btnSecondary} onClick={addImage}>
            Add image
          </button>
        </div>

        <div className="grid gap-3">
          {values.media.map((m, idx) => (
            <div key={idx} className="grid gap-2 sm:grid-cols-[1fr,1fr,auto]">
              <label className="block">
                <span className={labelCls}>Image URL</span>
                <input
                  className={inputCls}
                  placeholder="https://…"
                  value={m.url}
                  onChange={(e) => updateMedia(idx, "url", e.target.value)}
                />
              </label>

              <label className="block">
                <span className={labelCls}>Alt text (optional)</span>
                <input
                  className={inputCls}
                  value={m.alt || ""}
                  onChange={(e) => updateMedia(idx, "alt", e.target.value)}
                />
              </label>

              <div className="flex items-end">
                <button type="button" onClick={() => removeImage(idx)} className={btnSecondary}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-ink/60">
          Tip: Use publicly reachable HTTPS URLs. The first image is used as the cover.
        </p>
      </section>

      {/* Location */}
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

      {/* Amenities */}
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

      <div>
        <button type="submit" disabled={!!submitting} className={btnPrimary}>
          {submitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}