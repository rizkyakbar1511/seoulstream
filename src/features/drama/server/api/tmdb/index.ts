import { config } from "@/lib/config";
import { http } from "@/lib/http";
import type { TmdbCreditsResponse, TmdbSearchResponse } from "./types";

export async function getDramaCredits({
  type,
  query,
}: {
  type: string;
  query: string;
}) {
  const dramaResponse = await http<TmdbSearchResponse>({
    baseURL: config.TMDB_API_BASE_URL,
    path: `/search/${type}?query=${query}`,
    opts: {
      headers: {
        Authorization: `Bearer ${config.TMDB_READ_ACCESS_TOKEN}`,
        accept: "application/json",
      },
    },
  });

  if (dramaResponse.results.length === 0)
    return {
      crew: [],
      cast: [],
    };

  const creditsResponse = await http<TmdbCreditsResponse>({
    baseURL: config.TMDB_API_BASE_URL,
    path: `/${type}/${dramaResponse.results[0].id}/credits`,
    opts: {
      headers: {
        Authorization: `Bearer ${config.TMDB_READ_ACCESS_TOKEN}`,
        accept: "application/json",
      },
    },
  });

  return creditsResponse;
}
