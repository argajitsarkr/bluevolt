// Public URL - used by client-side code (browser sees this).
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Server-side URL - used inside Server Components and Route Handlers.
// Defaults to the docker service hostname when running in the compose network,
// falls back to the public URL otherwise.
export const SERVER_API_URL = process.env.BACKEND_INTERNAL_URL || API_URL;

type Opts = RequestInit & { token?: string };

export async function api<T = any>(path: string, opts: Opts = {}): Promise<T> {
  const isServer = typeof window === "undefined";
  const base = isServer ? SERVER_API_URL : API_URL;
  const { token, headers, ...rest } = opts;
  const res = await fetch(`${base}${path}`, {
    ...rest,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
