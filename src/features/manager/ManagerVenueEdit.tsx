import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getVenueById, updateVenue, type VenuePayload } from "../venues/api";
import type { Venue } from "../venues/types";
import VenueForm, { type VenueFormValues } from "./VenueForm";

function fromVenueToFormValues(v: Venue): VenueFormValues {
  return {
    name: v.name,
    description: v.description ?? "",
    price: String(v.price),
    maxGuests: String(v.maxGuests),
    rating: v.rating != null ? String(v.rating) : "", // ← add
    // map alle eksisterende bilder til formens struktur
    media: (v.media ?? []).map((m) => ({
      url: m.url ?? "",
      alt: m.alt ?? "",
    })),
    address: v.location?.address ?? "",
    city: v.location?.city ?? "",
    country: v.location?.country ?? "",
    wifi: v.meta?.wifi ?? false,
    parking: v.meta?.parking ?? false,
    breakfast: v.meta?.breakfast ?? false,
    pets: v.meta?.pets ?? false,
  };
}

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
    rating, // ← add (optional 0–5)
    // send alle gyldige bilder (trim og filtrer tomme)
    media: values.media
      .filter((m) => m.url && m.url.trim().length > 0)
      .map((m) => ({
        url: m.url.trim(),
        alt: (m.alt?.trim()?.length ? m.alt!.trim() : values.name),
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
  };
}

export default function ManagerVenueEdit() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Venue>({
    queryKey: ["venue", id],
    queryFn: () => getVenueById(id),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: (values: VenueFormValues) => updateVenue(id, toPayload(values)),
    onSuccess: () => {
      // oppdater cache og gå tilbake til oversikten
      qc.invalidateQueries({ queryKey: ["venue", id] });
      qc.invalidateQueries({ queryKey: ["managed-venues"] });
      navigate("/manager/venues");
    },
  });

  if (isLoading) return <p>Loading venue…</p>;
  if (isError || !data)
    return (
      <p className="text-red-600">
        Error: {(error as Error)?.message ?? "Not found"}
      </p>
    );

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">Edit venue</h1>
      <VenueForm
        initialValues={fromVenueToFormValues(data)}
        submitLabel="Save changes"
        submitting={mutation.isPending}
        onSubmit={(values) => mutation.mutate(values)}
      />
      {mutation.isError && (
        <p className="text-sm text-red-600">
          Error: {(mutation.error as Error).message}
        </p>
      )}
    </div>
  );
}