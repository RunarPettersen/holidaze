import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

import { useAuth } from "../auth/AuthContext";
import { getManagedVenues, deleteVenue } from "../venues/api";
import type { Venue } from "../venues/types";
import ConfirmDialog from "../../components/ConfirmDialog";

/**
 * Manager dashboard view listing all venues owned by the current user.
 * Allows creating, editing, viewing bookings and deleting venues.
 */
export default function ManagerVenues() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const name = user?.name ?? "";

  const { data, isLoading, isError, error } = useQuery<Venue[]>({
    queryKey: ["managed-venues", name],
    queryFn: () => getManagedVenues(name),
    enabled: !!name,
  });

  const [toDeleteId, setToDeleteId] = React.useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (id: string) => deleteVenue(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["managed-venues", name] });
      setToDeleteId(null);
    },
  });

  if (isLoading) return <p>Loading venues…</p>;
  if (isError) return <p className="text-red-600">Error: {(error as Error).message}</p>;

  const venues = data ?? [];
  const venueForDialog = toDeleteId ? venues.find((v) => v.id === toDeleteId) : undefined;

  async function confirmDelete() {
    if (!toDeleteId) return;
    try {
      await mutation.mutateAsync(toDeleteId);
    } finally {
      setToDeleteId(null);
    }
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My venues</h1>
        <button
          className="bg-brand-900 hover:bg-brand-800 cursor-pointer rounded px-4 py-2 text-white"
          onClick={() => navigate("/manager/venues/new")}
        >
          Create new venue
        </button>
      </div>

      {venues.length === 0 ? (
        <p>You have no venues yet. Create your first one above.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {venues.map((v) => {
            const cover = v.media?.[0];
            const coverUrl = cover?.url || "/images/noimage.jpg";
            const coverAlt = cover?.alt ?? v.name ?? "Venue image";

            return (
              <li key={v.id} className="flex flex-col overflow-hidden rounded-xl border">
                <Link to={`/venues/${v.id}`} className="block">
                  <div className="aspect-[16/10] bg-gray-100">
                    <img
                      src={coverUrl}
                      alt={coverAlt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </Link>
                <div className="flex flex-1 flex-col gap-2 bg-white p-4">
                  <div>
                    <h3 className="font-semibold">{v.name}</h3>
                    <p className="text-sm text-gray-600">
                      {v.location?.city ?? ""} {v.location?.country ?? ""}
                    </p>
                    <p className="text-sm">
                      Max {v.maxGuests} guests • {v.price} NOK / night
                    </p>
                  </div>
                  <div className="mt-2 flex justify-between gap-2 text-sm">
                    <button
                      className="bg-brand-900 hover:bg-brand-800 cursor-pointer rounded px-4 py-2 text-white"
                      onClick={() => navigate(`/manager/venues/${v.id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-brand-900 hover:bg-brand-800 cursor-pointer rounded px-4 py-2 text-white"
                      onClick={() => navigate(`/manager/venues/${v.id}/bookings`)}
                    >
                      Bookings
                    </button>
                    <button
                      className="cursor-pointer rounded border px-4 py-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                      disabled={mutation.isPending && toDeleteId === v.id}
                      onClick={() => setToDeleteId(v.id)}
                    >
                      {mutation.isPending && toDeleteId === v.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={!!toDeleteId}
        title="Delete this venue?"
        message={
          venueForDialog ? (
            <div>
              <p className="mb-1">{venueForDialog.name}</p>
              <p className="text-sm text-gray-600">
                This action cannot be undone and will remove the venue from your listings.
              </p>
            </div>
          ) : (
            "This action cannot be undone."
          )
        }
        confirmLabel="Yes, delete"
        cancelLabel="Cancel"
        loading={mutation.isPending}
        onConfirm={confirmDelete}
        onClose={() => (!mutation.isPending ? setToDeleteId(null) : null)}
      />
    </div>
  );
}