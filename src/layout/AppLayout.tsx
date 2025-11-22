import { useEffect, useState } from "react";
import { Outlet, Link, NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../features/auth/AuthContext";
import { getMyBookings } from "../features/bookings/api";
import { isUpcoming } from "../lib/date";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { data: myBookings } = useQuery({
    queryKey: ["my-bookings-count", user?.name],
    queryFn: () => getMyBookings(user?.name ?? ""),
    enabled: !!user?.name,
  });

  const upcomingCount = (myBookings ?? []).filter((b) => isUpcoming(b.dateTo)).length;

  const [menuOpen, setMenuOpen] = useState(false);

  // Close on Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const linkClass = (isActive: boolean) =>
    isActive ? "text-brand-900 font-medium" : "text-brand-800 hover:underline";

  return (
    <div className="min-h-screen bg-surface text-ink flex flex-col">
      <header className="sticky top-0 border-b bg-white/80 backdrop-blur z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
            <img
              src="/images/logo/holidaze.png"
              alt="Holidaze"
              className="h-8 w-auto"
              loading="eager"
              decoding="async"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-4 text-sm">
            <NavLink to="/venues" className={({ isActive }) => linkClass(isActive)}>
              Venues
            </NavLink>

            {user && (
              <>
                {user.venueManager && (
                  <NavLink to="/manager/venues" className={({ isActive }) => linkClass(isActive)}>
                    Manage venues
                  </NavLink>
                )}

                <NavLink to="/bookings" className={({ isActive }) => linkClass(isActive)}>
                  My bookings{upcomingCount ? ` (${upcomingCount})` : ""}
                </NavLink>

                <NavLink to="/profile" className={({ isActive }) => linkClass(isActive)}>
                  Profile
                </NavLink>

                {user.avatarUrl && (
                  <NavLink to="/profile" className="shrink-0" aria-label="Profile">
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover border"
                    />
                  </NavLink>
                )}

                <button
                  onClick={logout}
                  className="bg-brand-900 hover:bg-brand-800 cursor-pointer rounded px-3 py-1 text-white"
                >
                  Logout
                </button>
              </>
            )}

            {!user && (
              <NavLink
                to="/auth/login"
                className={({ isActive }) =>
                  isActive ? "bg-brand-900 hover:bg-brand-800 cursor-pointer rounded px-3 py-1 text-white" : "bg-brand-900 hover:bg-brand-800 cursor-pointer rounded px-3 py-1 text-white"
                }
              >
                Login
              </NavLink>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded p-2 hover:bg-gray-100"
            aria-label="Toggle menu"
            aria-controls="mobile-menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {/* Hamburger / Close icons */}
            {!menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu panel */}
        {/* Overlay to close on click outside */}
        {menuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        <div
          id="mobile-menu"
          className={`md:hidden absolute left-0 right-0 top-full origin-top bg-white border-b shadow-sm transition-transform ${
            menuOpen ? "scale-y-100" : "scale-y-0"
          }`}
          style={{ transformOrigin: "top" }}
        >
          <div className="mx-auto max-w-6xl px-4 py-4">
            <div className="flex flex-col gap-3 text-sm">
              <NavLink to="/venues" onClick={() => setMenuOpen(false)} className={({ isActive }) => linkClass(isActive)}>
                Venues
              </NavLink>

              {user && (
                <>
                  {user.venueManager && (
                    <NavLink to="/manager/venues" onClick={() => setMenuOpen(false)} className={({ isActive }) => linkClass(isActive)}>
                      Manage venues
                    </NavLink>
                  )}

                  <NavLink to="/bookings" onClick={() => setMenuOpen(false)} className={({ isActive }) => linkClass(isActive)}>
                    My bookings{upcomingCount ? ` (${upcomingCount})` : ""}
                  </NavLink>

                  <NavLink to="/profile" onClick={() => setMenuOpen(false)} className={({ isActive }) => linkClass(isActive)}>
                    Profile
                  </NavLink>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="text-left rounded border px-3 py-1 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </>
              )}

              {!user && (
                <NavLink
                  to="/auth/login"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive ? "text-brand-900 font-medium" : "bg-brand rounded px-3 py-2 text-white inline-block"
                  }
                >
                  Login
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <Outlet />
        </div>
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-500">
          © {new Date().getFullYear()} Holidaze
        </div>
      </footer>
    </div>
  );
}