import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

export default function Protected() {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <p>Laster…</p>;
  if (!user) return <Navigate to="/auth/login" replace state={{ from: loc }} />;
  return <Outlet />;
}