import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "../auth/AuthContext";
import { getManagedVenues, deleteVenue } from "../venues/api";
import type { Venue } from "../venues/types";

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

  const mutation = useMutation({
    mutationFn: (id: string) => deleteVenue(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["managed-venues", name] });
    },
  });

  if (isLoading) return <p>Loading venues…</p>;
  if (isError) return <p className="text-red-600">Error: {(error as Error).message}</p>;

  const venues = data ?? [];

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My venues</h1>
        <button
          className="bg-brand rounded px-4 py-2 text-white"
          onClick={() => navigate("/manager/venues/new")}
        >
          Create new venue
        </button>
      </div>

      {venues.length === 0 ? (
        <p>You have no venues yet. Create your first one above.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {venues.map((v) => (
            <li key={v.id} className="flex flex-col overflow-hidden rounded-xl border">
              <Link to={`/venues/${v.id}`} className="block">
                <div className="aspect-[16/10] bg-gray-100">
                  {v.media?.[0]?.url && (
                    <img
                      src={v.media[0].url}
                      alt={v.media[0].alt ?? v.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              </Link>
              <div className="flex flex-1 flex-col gap-2 p-4">
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
                    className="rounded border px-3 py-1 hover:bg-gray-50"
                    onClick={() => navigate(`/manager/venues/${v.id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded border px-3 py-1 hover:bg-gray-50"
                    onClick={() => navigate(`/manager/venues/${v.id}/bookings`)}
                  >
                    Bookings
                  </button>
                  <button
                    className="rounded border px-3 py-1 text-red-600 hover:bg-red-50 disabled:opacity-50"
                    disabled={mutation.isPending}
                    onClick={() => {
                      const ok = window.confirm("Are you sure you want to delete this venue?");
                      if (!ok) return;
                      mutation.mutate(v.id);
                    }}
                  >
                    {mutation.isPending ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
