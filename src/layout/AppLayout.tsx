import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../features/auth/AuthContext";
import { getMyBookings } from "../features/bookings/api";
import { isUpcoming } from "../lib/date";
import MainHeader from "./MainHeader";
import MainFooter from "./MainFooter";

/**
 * Top-level application layout.
 *
 * Renders the persistent header and footer,
 * and the active route content via <Outlet />.
 */
export default function AppLayout() {
  const { user, logout } = useAuth();

  const { data: myBookings } = useQuery({
    queryKey: ["my-bookings", user?.name],
    queryFn: () => getMyBookings(user?.name ?? ""),
    enabled: !!user?.name,
  });

  const upcomingCount = (myBookings ?? []).filter((b) => isUpcoming(b.dateTo)).length;

  return (
    <div className="bg-surface text-ink flex min-h-screen flex-col">
      <MainHeader user={user ?? null} upcomingCount={upcomingCount} onLogout={logout} />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <Outlet />
        </div>
      </main>

      <MainFooter />
    </div>
  );
}