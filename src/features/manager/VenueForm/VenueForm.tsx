import { useState } from "react";
import BasicInfoFields from "./BasicInfoFields";
import ImagesSection from "./ImagesSection";
import LocationFields from "./LocationFields";
import AmenitiesFieldset from "./AmenitiesFieldset";

export type VenueFormValues = {
  name: string;
  description: string;
  price: number | string;
  maxGuests: number | string;
  rating: string;
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
  rating: "",
  media: [{ url: "", alt: "" }],
  address: "",
  city: "",
  country: "",
  wifi: false,
  parking: false,
  breakfast: false,
  pets: false,
};

export const MAX_PRICE = 10_000;

export default function VenueForm({
  initialValues,
  submitLabel,
  submitting,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<VenueFormValues>({
    ...defaultValues,
    ...initialValues,
    media:
      initialValues?.media && initialValues.media.length > 0
        ? initialValues.media.map((m) => ({ url: m.url || "", alt: m.alt || "" }))
        : defaultValues.media,
    rating:
      typeof initialValues?.rating === "number"
        ? String(initialValues.rating)
        : initialValues?.rating ?? "",
  });

  function update<K extends keyof VenueFormValues>(
    key: K,
    val: VenueFormValues[K],
  ) {
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

  // små style-tokens
  const labelCls = "block text-sm font-medium text-ink/80 mb-1";
  const inputCls =
    "w-full rounded border border-ink/20 bg-white/70 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-300";
  const fieldsetCls =
    "grid gap-2 rounded-xl border border-ink/20 bg-white/60 p-4";
  const btnSecondary =
    "rounded border border-ink/20 bg-white px-3 py-2 text-sm hover:bg-white/80 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const btnPrimary =
    "bg-brand-900 hover:bg-brand-800 text-white rounded px-4 py-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <BasicInfoFields
        values={values}
        update={update}
        maxPrice={MAX_PRICE}
        labelCls={labelCls}
        inputCls={inputCls}
      />

      <ImagesSection
        media={values.media}
        labelCls={labelCls}
        inputCls={inputCls}
        fieldsetCls={fieldsetCls}
        btnSecondary={btnSecondary}
        addImage={addImage}
        removeImage={removeImage}
        updateMedia={updateMedia}
      />

      <LocationFields
        values={values}
        update={update}
        labelCls={labelCls}
        inputCls={inputCls}
      />

      <AmenitiesFieldset
        values={values}
        update={update}
        fieldsetCls={fieldsetCls}
      />

      <div>
        <button type="submit" disabled={!!submitting} className={btnPrimary}>
          {submitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}