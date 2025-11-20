import { useState } from "react";
import { registerUser } from "./api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // må ende med @stud.noroff.no
  const [password, setPassword] = useState("");
  const [venueManager, setVenueManager] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registerUser({
        name,
        email,
        password,
        venueManager,
        avatar: avatarUrl ? { url: avatarUrl, alt: name } : undefined,
      });
      nav("/auth/login");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-md gap-4">
      <h1 className="text-2xl font-semibold">Create account</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <label className="grid gap-1">
        <span>Name</span>
        <input
          className="rounded border px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label className="grid gap-1">
        <span>Email (@stud.noroff.no)</span>
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
      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          checked={venueManager}
          onChange={(e) => setVenueManager(e.target.checked)}
        />
        <span>Register as Venue Manager</span>
      </label>
      <label className="grid gap-1">
        <span>Avatar URL (optional)</span>
        <input
          className="rounded border px-3 py-2"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://…"
        />
      </label>
      <button disabled={loading} className="bg-brand rounded px-4 py-2 text-white">
        {loading ? "Registering…" : "Register"}
      </button>
    </form>
  );
}
