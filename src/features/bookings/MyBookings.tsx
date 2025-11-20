import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import { getMyBookings, cancelBooking } from "./api";
import type { Booking } from "./types";
import { fmt, isUpcoming, isPast } from "../../lib/date";

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

  const mutation = useMutation({
    mutationFn: (id: string) => cancelBooking(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-bookings", name] });
      qc.invalidateQueries({ queryKey: ["my-bookings-count", name] });
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4">
        <h1 className="text-2xl font-semibold">Mine bookinger</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border overflow-hidden animate-pulse bg-gray-50"
            >
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
        <h1 className="text-2xl font-semibold">Mine bookinger</h1>
        <p className="text-sm text-red-600">
          Feil: {(error as Error).message}
        </p>
      </div>
    );
  }

  const all = data ?? [];
  const upcoming = all.filter((b) => isUpcoming(b.dateTo));
  const past = all.filter((b) => isPast(b.dateTo));

  let shown: Booking[] = [];
  if (tab === "upcoming") shown = upcoming;
  if (tab === "past") shown = past;
  if (tab === "all") shown = all;

  const emptyText =
    tab === "upcoming"
      ? "Ingen kommende bookinger."
      : tab === "past"
      ? "Ingen tidligere bookinger."
      : "Ingen bookinger enda.";

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Mine bookinger</h1>

        <div className="inline-flex rounded-lg border bg-gray-50 text-sm overflow-hidden">
          <TabButton label="Upcoming" value="upcoming" tab={tab} setTab={setTab} />
          <TabButton label="Past" value="past" tab={tab} setTab={setTab} />
          <TabButton label="All" value="all" tab={tab} setTab={setTab} />
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="grid gap-3 text-sm text-gray-700">
          <p>{emptyText}</p>
          <div>
            <Link
              to="/venues"
              className="inline-flex rounded bg-brand px-4 py-2 text-white"
            >
              Finn steder
            </Link>
          </div>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map((b) => (
            <li key={b.id} className="rounded-xl border overflow-hidden flex flex-col">
              <Link to={`/venues/${b.venue?.id ?? ""}`} className="block">
                <div className="aspect-[16/10] bg-gray-100">
                  {b.venue?.media?.[0]?.url && (
                    <img
                      src={b.venue.media[0].url}
                      alt={b.venue.media[0].alt ?? b.venue.name ?? "Venue"}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              </Link>
              <div className="p-4 flex-1 flex flex-col gap-2">
                <div>
                  <h3 className="font-semibold">
                    {b.venue?.name ?? "Ukjent sted"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {fmt(b.dateFrom)} – {fmt(b.dateTo)} • {b.guests} gjester
                  </p>
                  <p className="text-sm text-gray-600">
                    {b.venue?.location?.city ?? ""}{" "}
                    {b.venue?.location?.country ?? ""}
                  </p>
                </div>

                <div className="mt-2 flex items-center justify-between gap-2 text-sm">
                  {typeof b.venue?.price === "number" && (
                    <p>Ca. {b.venue.price} NOK / natt</p>
                  )}

                  {isUpcoming(b.dateTo) && (
                    <button
                      className="rounded border px-3 py-1 text-red-600 hover:bg-red-50 disabled:opacity-50"
                      disabled={mutation.isPending}
                      onClick={() => {
                        const ok = window.confirm(
                          "Er du sikker på at du vil kansellere denne bookingen?"
                        );
                        if (!ok) return;
                        mutation.mutate(b.id);
                      }}
                    >
                      {mutation.isPending ? "Kansellerer…" : "Kanseller"}
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

type TabButtonProps = {
  label: string;
  value: Tab;
  tab: Tab;
  setTab: (t: Tab) => void;
};

function TabButton({ label, value, tab, setTab }: TabButtonProps) {
  const active = tab === value;
  return (
    <button
      type="button"
      onClick={() => setTab(value)}
      className={
        "px-3 py-1" +
        (active ? " bg-white text-brand" : " text-gray-600 hover:bg-gray-100")
      }
    >
      {label}
    </button>
  );
}