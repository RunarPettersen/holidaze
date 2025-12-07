import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

type HeaderUser = {
  name: string;
  avatarUrl?: string;
  venueManager?: boolean;
} | null;

type Props = {
  user: HeaderUser;
  upcomingCount: number;
  onLogout: () => void;
};

/**
 * Main site header with logo, primary navigation
 * and responsive mobile menu.
 */
export default function MainHeader({ user, upcomingCount, onLogout }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const linkClass = (isActive: boolean) =>
    isActive ? "text-brand-900 font-medium" : "text-black hover:underline";

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
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
        <nav className="hidden items-center gap-4 text-sm md:flex">
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
                <NavLink
                  to="/profile"
                  className="shrink-0"
                  aria-label={user.name ? `${user.name}'s profile` : "Profile"}
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name ? `${user.name}'s avatar` : "User avatar"}
                    className="h-8 w-8 rounded-full border object-cover"
                  />
                </NavLink>
              )}

              <button
                onClick={onLogout}
                className="hover:bg-brand-100 cursor-pointer rounded border px-3 py-1 text-black"
              >
                Logout
              </button>
            </>
          )}

          {!user && (
            <NavLink
              to="/auth/login"
              className={({ isActive }) =>
                isActive
                  ? "hover:bg-brand-900 cursor-pointer rounded bg-black px-3 py-1 text-white"
                  : "bg-brand-900 hover:bg-brand-800 cursor-pointer rounded px-3 py-1 text-white"
              }
            >
              Login
            </NavLink>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded p-2 hover:bg-gray-100 md:hidden"
          aria-label="Toggle menu"
          aria-controls="mobile-menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {!menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6l-12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`absolute top-full right-0 left-0 origin-top border-b bg-white shadow-sm transition-transform md:hidden ${
          menuOpen ? "scale-y-100" : "scale-y-0"
        }`}
        style={{ transformOrigin: "top" }}
      >
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex flex-col gap-3 text-sm">
            <NavLink
              to="/venues"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => linkClass(isActive)}
            >
              Venues
            </NavLink>

            {user && (
              <>
                {user.venueManager && (
                  <NavLink
                    to="/manager/venues"
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) => linkClass(isActive)}
                  >
                    Manage venues
                  </NavLink>
                )}

                <NavLink
                  to="/bookings"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => linkClass(isActive)}
                >
                  My bookings{upcomingCount ? ` (${upcomingCount})` : ""}
                </NavLink>

                <NavLink
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => linkClass(isActive)}
                >
                  Profile
                </NavLink>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onLogout();
                  }}
                  className="rounded border bg-black px-3 py-1 text-left text-white hover:bg-gray-50"
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
                  isActive
                    ? "text-brand-900 font-medium"
                    : "inline-block rounded bg-black px-3 py-2 text-white"
                }
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
