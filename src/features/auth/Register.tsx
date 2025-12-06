import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "./api";

/**
 * Registration form for new Holidaze users.
 *
 * Noroff's Holidaze API only accepts:
 * - Student email addresses that end with `@stud.noroff.no`
 * - Usernames that only contain letters, numbers, and underscores (a–z, 0–9, _)
 *
 * This component enforces those rules on the client and shows clear,
 * user-friendly error messages.
 */
export default function Register() {
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // must end with @stud.noroff.no
  const [password, setPassword] = useState("");
  const [venueManager, setVenueManager] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Client-side validation for the registration form.
   *
   * Checks:
   * - Name uses only allowed characters (a–z, 0–9, _)
   * - Email ends with @stud.noroff.no
   *
   * Returns a string with an error message, or null if everything is valid.
   */
  function validateForm(): string | null {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    const namePattern = /^[A-Za-z0-9_]+$/;

    if (!trimmedName) {
      return "Name is required.";
    }

    if (!namePattern.test(trimmedName)) {
      return "Name can only contain letters, numbers, and underscores (a–z, 0–9, _).";
    }

    if (!trimmedEmail.toLowerCase().endsWith("@stud.noroff.no")) {
      return "Email must end with @stud.noroff.no (Noroff student email).";
    }

    if (!password) {
      return "Password is required.";
    }

    // You could add more password rules here if you want (length, etc.)
    return null;
  }

  /**
   * Handles submit of the registration form.
   *
   * - Runs local validation for name and email (to match Noroff rules)
   * - Calls the Noroff /auth/register endpoint via registerUser
   * - Redirects to the login page on success
   */
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    setLoading(true);
    try {
      await registerUser({
        name: trimmedName,
        email: trimmedEmail,
        password,
        venueManager,
        avatar: avatarUrl
          ? { url: avatarUrl.trim(), alt: trimmedName || "User avatar" }
          : undefined,
      });

      nav("/auth/login");
    } catch (err: unknown) {
      // Fallback if the API still rejects something (e.g., name already taken)
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
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
          className="rounded border px-3 py-2 bg-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <span className="text-xs text-gray-600">
          Use only letters, numbers, and underscores (a–z, 0–9, _). No spaces.
        </span>
      </label>

      <label className="grid gap-1">
        <span>Email (must be a @stud.noroff.no address)</span>
        <input
          className="rounded border px-3 py-2 bg-white"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <span className="text-xs text-gray-600">
          Use your Noroff student email, for example: yourname@stud.noroff.no
        </span>
      </label>

      <label className="grid gap-1">
        <span>Password</span>
        <input
          className="rounded border px-3 py-2 bg-white"
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
        <span>Register as venue manager</span>
      </label>

      <label className="grid gap-1">
        <span>Avatar URL (optional)</span>
        <input
          className="rounded border px-3 py-2 bg-white"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://…"
        />
        <span className="text-xs text-gray-600">
          Use a publicly accessible HTTPS image URL.
        </span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="bg-brand-900 hover:bg-brand-800 cursor-pointer rounded px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Registering…" : "Register"}
      </button>
    </form>
  );
}