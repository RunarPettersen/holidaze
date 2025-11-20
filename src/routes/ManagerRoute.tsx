import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

export default function ManagerRoute() {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) return <p>Loading…</p>;

  if (!user || !user.venueManager) {
    return <Navigate to="/" replace state={{ from: loc }} />;
  }

  return <Outlet />;
}