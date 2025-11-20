import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

type LoginLocationState = {
  from?: { pathname?: string };
};

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();

  const location = useLocation();
  const state = location.state as LoginLocationState | null;
  const redirectTo = state?.from?.pathname ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      nav(redirectTo, { replace: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Incorrect email or password";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md grid gap-4">
      <h1 className="text-2xl font-semibold">Log in</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <label className="grid gap-1">
        <span>Email</span>
        <input
          className="rounded border px-3 py-2"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label className="grid gap-1">
        <span>Password</span>
        <input
          className="rounded border px-3 py-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>

      <button
        disabled={loading}
        className="rounded bg-brand text-white px-4 py-2"
      >
        {loading ? "Logging in…" : "Log in"}
      </button>

      <p className="text-sm text-gray-600">
        No account?{" "}
        <Link className="text-brand" to="/auth/register">
          Register
        </Link>
      </p>
    </form>
  );
}