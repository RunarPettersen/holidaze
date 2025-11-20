import { ENV } from "./env";
import { getToken } from "../features/auth/authStore";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type Json = Record<string, unknown> | undefined;

export async function api<T>(
  path: string,
  opts: { method?: HttpMethod; body?: Json; query?: Record<string, string | number | boolean> } = {}
): Promise<T> {
  const url = new URL(path, ENV.API_BASE);
  if (opts.query) {
    for (const [k, v] of Object.entries(opts.query)) url.searchParams.set(k, String(v));
  }

  const token = getToken();
  const res = await fetch(url.toString(), {
    method: opts.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": ENV.API_KEY,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status} ${res.statusText}: ${text}`);
  }
  // We accept "any" here because the API wraps responses as { data, meta }
  // and we normalise to T.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const json = (await res.json().catch(() => null)) as any;
  return (json?.data ?? json) as T;
}
