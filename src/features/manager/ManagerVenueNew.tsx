import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { createVenue, type VenuePayload } from "../venues/api";
import VenueForm, { type VenueFormValues } from "./VenueForm";

const MAX_PRICE = 10_000;

function toPayload(values: VenueFormValues): VenuePayload {
  const rating =
    values.rating === "" || values.rating === undefined
      ? undefined
      : Number(values.rating);

  return {
    name: values.name,
    description: values.description,
    price: Number(values.price),
    maxGuests: Number(values.maxGuests),
    media: values.media
      .filter((m) => m.url.trim())
      .map((m) => ({
        url: m.url.trim(),
        alt: (m.alt?.trim() || values.name).trim(),
      })),
    location: {
      address: values.address || undefined,
      city: values.city || undefined,
      country: values.country || undefined,
    },
    meta: {
      wifi: values.wifi,
      parking: values.parking,
      breakfast: values.breakfast,
      pets: values.pets,
    },
    rating,
  };
}

export default function ManagerVenueNew() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [priceError, setPriceError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (values: VenueFormValues) => createVenue(toPayload(values)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["managed-venues"] });
      navigate("/manager/venues");
    },
  });

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">Create new venue</h1>
      <VenueForm
        submitLabel="Create venue"
        submitting={mutation.isPending}
        onSubmit={(values) => {
          const price = Number(values.price);

          if (price > MAX_PRICE) {
            setPriceError(
              "Price cannot be higher than 10 000 NOK (API limit). Please lower the price.",
            );
            return;
          }

          setPriceError(null);
          mutation.mutate(values);
        }}
      />

      {priceError && (
        <p className="text-sm text-red-600">{priceError}</p>
      )}

      {mutation.isError && (
        <p className="text-sm text-red-600">
          Error: {(mutation.error as Error).message}
        </p>
      )}
    </div>
  );
}