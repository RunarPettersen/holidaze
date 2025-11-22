import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import { getMyBookings, cancelBooking } from "./api";
import type { Booking } from "./types";
import { fmt } from "../../lib/date";
import ConfirmDialog from "../../components/ConfirmDialog";
import BookingCard from "./BookingCard";
import TabBar from "../../components/TabBar";
import { partitionBookings } from "./partition";

type Tab = "upcoming" | "past" | "all";

export default function MyBookings() {
  const { user } = useAuth();
  const name = user?.name ?? "";
  const qc = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Booking[]>({
    queryKey: ["my-bookings", name],
    queryFn: () => getMyBookings(name),
    enabled: !!name,
  });

  const [tab, setTab] = React.useState<Tab>("upcoming");
  const [toCancelId, setToCancelId] = React.useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (id: string) => cancelBooking(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-bookings", name] });
      qc.invalidateQueries({ queryKey: ["my-bookings-count", name] });
    },
  });

  async function confirmCancel() {
    if (!toCancelId) return;
    try {
      await mutation.mutateAsync(toCancelId);
    } finally {
      setToCancelId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-4">
        <h1 className="text-2xl font-semibold">My Bookings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border overflow-hidden animate-pulse bg-gray-50">
              <div className="aspect-[16/10] bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="grid gap-3">
        <h1 className="text-2xl font-semibold">My Bookings</h1>
        <p className="text-sm text-red-600">Error: {(error as Error).message}</p>
      </div>
    );
  }

  const all = data ?? [];
  const { upcoming, past } = partitionBookings(all);

  const shown =
    tab === "upcoming" ? upcoming : tab === "past" ? past : all;

  const emptyText =
    tab === "upcoming"
      ? "No upcoming bookings."
      : tab === "past"
      ? "No past bookings."
      : "No bookings yet.";

  const bookingForDialog = toCancelId ? all.find((b) => b.id === toCancelId) : undefined;

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">My Bookings</h1>
        <TabBar
          items={[
            { value: "upcoming", label: "Upcoming" },
            { value: "past", label: "Past" },
            { value: "all", label: "All" },
          ]}
          value={tab}
          onChange={setTab}
        />
      </div>

      {shown.length === 0 ? (
        <div className="grid gap-3 text-sm text-gray-700">
          <p>{emptyText}</p>
          <div>
            <Link to="/venues" className="bg-brand-900 hover:bg-brand-800 cursor-pointer rounded px-4 py-2 text-white">
              Find venues
            </Link>
          </div>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              onCancelClick={(id) => setToCancelId(id)}
              cancelPending={mutation.isPending && toCancelId === b.id}
            />
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={!!toCancelId}
        title="Cancel this booking?"
        message={
          bookingForDialog ? (
            <div>
              <p className="mb-1">{bookingForDialog.venue?.name ?? "This venue"}</p>
              <p className="text-gray-600 text-sm">
                {fmt(bookingForDialog.dateFrom)} – {fmt(bookingForDialog.dateTo)} • {bookingForDialog.guests} guests
              </p>
            </div>
          ) : (
            "This action cannot be undone."
          )
        }
        confirmLabel="Yes, cancel"
        cancelLabel="Keep booking"
        loading={mutation.isPending}
        onConfirm={confirmCancel}
        onClose={() => (!mutation.isPending ? setToCancelId(null) : null)}
      />
    </div>
  );
}