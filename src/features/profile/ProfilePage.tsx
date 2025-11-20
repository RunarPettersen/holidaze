import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { useAuth } from "../auth/AuthContext";
import { updateAvatar } from "../auth/api";

export default function ProfilePage() {
  const { user, refresh } = useAuth();

  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? "");
  const [avatarAlt, setAvatarAlt] = useState(user?.name ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("You must be logged in to update your avatar.");
      }

      return updateAvatar(user.name, {
        url: avatarUrl,
        alt: avatarAlt || user.name,
      });
    },
    onSuccess: async () => {
      setMessage("Avatar updated successfully.");
      setError(null);
      await refresh();
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Could not update avatar.";
      setError(msg);
      setMessage(null);
    },
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!avatarUrl) {
      setError("Please enter an image URL.");
      return;
    }

    mutation.mutate();
  }

  // Do the "not logged in" branch *after* hooks
  if (!user) {
    return <p>You need to be logged in to view your profile.</p>;
  }

  const role = user.venueManager ? "Venue Manager" : "Customer";

  return (
    <div className="grid gap-6 max-w-xl">
      <header className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xl font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{user.name}</h1>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
      </header>

      <section className="grid gap-3">
        <h2 className="text-lg font-semibold">Avatar</h2>
        <p className="text-sm text-gray-600">
          Paste a publicly accessible image URL to update your profile picture.
        </p>

        <form onSubmit={onSubmit} className="grid gap-3">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Avatar URL</span>
            <input
              className="rounded border px-3 py-2"
              placeholder="https://…"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Alt text (optional)</span>
            <input
              className="rounded border px-3 py-2"
              value={avatarAlt}
              onChange={(e) => setAvatarAlt(e.target.value)}
            />
          </label>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="inline-flex rounded bg-brand px-4 py-2 text-white disabled:opacity-60"
          >
            {mutation.isPending ? "Saving…" : "Save avatar"}
          </button>

          {message && (
            <p className="text-sm text-green-700" role="status">
              {message}
            </p>
          )}
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
        </form>

        {avatarUrl && (
          <div className="mt-2 grid gap-1">
            <span className="text-sm font-medium">Preview</span>
            <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100">
              <img
                src={avatarUrl}
                alt={avatarAlt || user.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}