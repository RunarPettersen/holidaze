import { api } from "../../lib/api";

export type LoginResponse = { name: string; email: string; accessToken: string; avatar?: { url: string; alt?: string }; venueManager?: boolean; };
export type Profile = { name: string; email: string; avatar?: { url: string; alt?: string }; venueManager?: boolean; };

export async function registerUser(input: {
  name: string;
  email: string;          // må slutte med @stud.noroff.no
  password: string;
  venueManager?: boolean; // valgfritt
  avatar?: { url: string; alt?: string };
}) {
  // Noroff krever at email ender med stud.noroff.no
  if (!input.email.toLowerCase().endsWith("@stud.noroff.no")) {
    throw new Error("Email må ende med @stud.noroff.no");
  }
  return api<Profile>("/auth/register", { method: "POST", body: input });
}

export async function loginUser(input: { email: string; password: string }) {
  return api<LoginResponse>("/auth/login", { method: "POST", body: input });
}

export async function getProfile(name: string) {
  return api<Profile>(`/holidaze/profiles/${encodeURIComponent(name)}`);
}

export async function updateAvatar(
  name: string,
  avatar: { url: string; alt?: string }
) {
  return api<Profile>(`/holidaze/profiles/${encodeURIComponent(name)}`, {
    method: "PUT",
    body: { avatar },
  });
}