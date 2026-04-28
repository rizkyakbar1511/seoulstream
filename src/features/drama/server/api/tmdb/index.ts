import { config } from "@/lib/config";
import { http } from "@/lib/http";
import type {
  TmdbCreditsRequestDTO,
  TmdbCreditsResponseDTO,
  TmdbSearchRequestDTO,
  TmdbSearchResponseDTO,
  TmdbSearchType,
} from "./dto";
import { buildParams } from "@/lib/utils";

export function searchTmdb(
  type: TmdbSearchType,
  request: TmdbSearchRequestDTO<TmdbSearchType>,
) {
  const params = buildParams(request);

  return http<TmdbSearchResponseDTO<TmdbSearchType>>({
    baseURL: config.TMDB_API_BASE_URL,
    path: `/search/${type}?${params.toString()}`,
    opts: {
      method: "GET",
      headers: {
        Authorization: `Bearer ${config.TMDB_READ_ACCESS_TOKEN}`,
        accept: "application/json",
      },
    },
  });
}

export function getCreditsTmdb(request: TmdbCreditsRequestDTO) {
  return http<TmdbCreditsResponseDTO>({
    baseURL: config.TMDB_API_BASE_URL,
    path: `/${request.type}/${request.id}/credits?${request.language ? `language=${request.language}` : ""}`,
    opts: {
      headers: {
        Authorization: `Bearer ${config.TMDB_READ_ACCESS_TOKEN}`,
        accept: "application/json",
      },
    },
  });
}
