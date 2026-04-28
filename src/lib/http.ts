import { config } from "@/lib/config";

type FetchOpts = RequestInit & { revalidate?: number | false };

export async function http<T>({
  baseURL = config.API_BASE_URL,
  path,
  opts = {},
}: {
  baseURL?: string;
  path: string;
  opts?: FetchOpts;
}): Promise<T> {
  const url = `${baseURL}${path}`;
  const defaultHeaders: HeadersInit = {
    "User-Agent": config.USER_AGENT,
    "Data-Agent": config.DATA_AGENT,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const fetchOpts: RequestInit = {
    ...opts,
    headers: {
      ...defaultHeaders,
      ...(opts.headers ?? {}),
    },
  };

  // If using Next's fetch caching: attach { next: { revalidate: 60 } } via RequestInit
  // TS typing won't show `next`, but Next's global fetch accepts it.
  const res = await fetch(url, fetchOpts);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed ${res.status} ${res.statusText}: ${text}`);
  }
  return res.json();
}
