import { api } from "../../lib/api";

/**
 * Avatar image metadata used on profiles.
 */
export type Avatar = {
  url: string;
  alt?: string;
};

/**
 * Response from the /auth/login endpoint.
 */
export type LoginResponse = {
  name: string;
  email: string;
  accessToken: string;
  avatar?: Avatar;
  venueManager?: boolean;
};

/**
 * Profile data for a Holidaze user.
 */
export type Profile = {
  name: string;
  email: string;
  avatar?: Avatar;
  venueManager?: boolean;
};

/**
 * Input payload for registering a new user.
 *
 * Constraints (from Noroff API):
 * - name: may only contain letters, numbers, and underscores (a–z, 0–9, _)
 * - email: must end with `@stud.noroff.no`
 */
export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  venueManager?: boolean;
  avatar?: Avatar;
};

/**
 * Registers a new user via the Noroff API.
 *
 * The Noroff API only accepts student email addresses that end with
 * `@stud.noroff.no`, so this function validates the email before sending
 * the request.
 *
 * @throws Error if the email does not end with `@stud.noroff.no`
 */
export async function registerUser(input: RegisterInput) {
  const email = input.email.trim().toLowerCase();

  if (!email.endsWith("@stud.noroff.no")) {
    throw new Error("Email must end with @stud.noroff.no (Noroff student email).");
  }

  return api<Profile>("/auth/register", {
    method: "POST",
    body: { ...input, email },
  });
}

/**
 * Logs in a user and returns the auth token and basic profile data.
 */
export async function loginUser(input: { email: string; password: string }) {
  return api<LoginResponse>("/auth/login", {
    method: "POST",
    body: input,
  });
}

/**
 * Fetches a profile by name.
 *
 * @param name Noroff profile name (username)
 */
export async function getProfile(name: string) {
  return api<Profile>(`/holidaze/profiles/${encodeURIComponent(name)}`);
}

/**
 * Updates the avatar image for a given profile.
 *
 * @param name   Noroff profile name (username)
 * @param avatar Avatar object containing a public image URL and optional alt text
 */
export async function updateAvatar(
  name: string,
  avatar: Avatar,
) {
  return api<Profile>(`/holidaze/profiles/${encodeURIComponent(name)}`, {
    method: "PUT",
    body: { avatar },
  });
}