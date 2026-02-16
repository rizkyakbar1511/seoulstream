import { TIME } from "@/constants";
import type {
  CategoryPostResponse,
  CategoryTypeNameEnum,
  CategoryTypeResponse,
  DramaDetailResponse,
  GenreListResponse,
  MovieListRequest,
  MovieListResponse,
  TmdbCreditsResponse,
  TmdbSearchResponse,
} from "@/types";
import { buildParams } from "../utils";

const {
  TMDB_READ_ACCESS_TOKEN,
  TMDB_API_BASE_URL,
  API_BASE_URL,
  DATA_AGENT,
  USER_AGENT,
} = process.env;

type FetchOpts = RequestInit & { revalidate?: number | false };

/**
 * serverFetch: thin wrapper used by server components
 * - use Next.js server fetch cache via `next` metadata like { next: { revalidate } }
 */

export async function serverFetch<T>({
  baseURL = API_BASE_URL,
  path,
  opts = {},
}: {
  baseURL?: string;
  path: string;
  opts?: FetchOpts;
}): Promise<T> {
  const url = `${baseURL}${path}`;
  const defaultHeaders: HeadersInit = {
    "User-Agent": USER_AGENT,
    "Data-Agent": DATA_AGENT,
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

export async function getDramaCredits({
  type,
  query,
}: {
  type: string;
  query: string;
}) {
  const dramaResponse = await serverFetch<TmdbSearchResponse>({
    baseURL: TMDB_API_BASE_URL,
    path: `/search/${type}?query=${query}`,
    opts: {
      headers: {
        Authorization: `Bearer ${TMDB_READ_ACCESS_TOKEN}`,
        accept: "application/json",
      },
    },
  });

  if (dramaResponse.results.length === 0)
    return {
      crew: [],
      cast: [],
    };

  const creditsResponse = await serverFetch<TmdbCreditsResponse>({
    baseURL: TMDB_API_BASE_URL,
    path: `/${type}/${dramaResponse.results[0].id}/credits`,
    opts: {
      headers: {
        Authorization: `Bearer ${TMDB_READ_ACCESS_TOKEN}`,
        accept: "application/json",
      },
    },
  });

  return creditsResponse;
}

export async function getAllDrama(request: MovieListRequest) {
  const params = buildParams<MovieListRequest>(request);

  const response = await serverFetch<MovieListResponse>({
    path: "/drakor/phalcon/api/get_category_all/v2/",
    opts: {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      next: { revalidate: TIME.ONE_DAY, tags: ["allDrama"] }, // default to 60 seconds}
    },
  });

  const data = {
    ...response,
    categories: response.categories.filter((category) => category.cid !== 1),
  };

  return data as MovieListResponse;
}

export async function getNewPostsDrama(request: MovieListRequest) {
  const params = buildParams<MovieListRequest>(request);

  const response = await serverFetch<MovieListResponse>({
    path: "/drakor/phalcon/api/get_new_posts_drakor/v2/",
    opts: {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      next: { revalidate: TIME.ONE_DAY, tags: ["newPostsDrama"] }, // default to 60 seconds}
    },
  });

  const data = {
    ...response,
    categories:
      request.page === 1 ? response.categories.slice(1) : response.categories,
  };

  return data as MovieListResponse;
}

export async function getOngoingDrama(request: MovieListRequest) {
  const params = buildParams<MovieListRequest>(request);

  const response = await serverFetch<MovieListResponse>({
    path: "/drakor/phalcon/api/get_category_ongoing_drakor/v2/",
    opts: {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      next: { revalidate: TIME.ONE_DAY, tags: ["ongoingDrama"] }, // default to 60 seconds}
    },
  });

  return response;
}

export async function getCategoryPost(
  request: MovieListRequest & { id: string },
) {
  const params = buildParams<MovieListRequest & { id: string }>(request);

  return await serverFetch<CategoryPostResponse>({
    path: "/drakor/phalcon/api/get_category_posts_drakor/v2/",
    opts: {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      next: { revalidate: TIME.ONE_DAY, tags: ["dramaDetails"] }, // default to 60 seconds}
    },
  });
}

export async function getDramaDetails(
  request: MovieListRequest & { id: string; channel_id?: string },
): Promise<CategoryPostResponse & DramaDetailResponse> {
  try {
    const params = buildParams<MovieListRequest & { id: string }>(request);

    const categoryPostResponse = await getCategoryPost(request);

    if (request.channel_id) params.append("channel_id", request.channel_id);
    else
      params.append(
        "channel_id",
        categoryPostResponse.posts[0].channel_id.toString(),
      );

    const dramaDetailResponse = await serverFetch<DramaDetailResponse>({
      path: "/drakor/phalcon/api/get_post_description_drakor/v2/",
      opts: {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
        next: { revalidate: TIME.ONE_DAY, tags: ["dramaDetails"] }, // default to 60 seconds}
      },
    });

    return {
      ...categoryPostResponse,
      ...dramaDetailResponse,
    };
  } catch (error) {
    console.log("🚀 ~ getDramaDetails ~ error:", error);
    throw error;
  }
}

export async function searchDrama(
  request: MovieListRequest & { pilihan: CategoryTypeNameEnum; search: string },
) {
  const params = buildParams<
    MovieListRequest & { pilihan: CategoryTypeNameEnum; search: string }
  >(request);

  const response = await serverFetch<MovieListResponse>({
    path: "/drakor/phalcon/api/search_category_collection/v2/",
    opts: {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      next: { revalidate: TIME.ONE_DAY, tags: ["searchDrama"] }, // default to 60 seconds}
    },
  });

  return response;
}

export async function getDramaCategoryType() {
  const response = await serverFetch<CategoryTypeResponse>({
    path: "/drakor/phalcon/api/get_category_type_list/v2/",
    opts: {
      next: { revalidate: TIME.ONE_DAY, tags: ["dramaCategoryType"] }, // default to 60 seconds}
    },
  });

  return response;
}

export async function getGenreList() {
  const response = await serverFetch<GenreListResponse>({
    path: "/drakor/phalcon/api/get_genre_list/v2/",
    opts: {
      next: { revalidate: TIME.ONE_DAY, tags: ["genreList"] }, // default to 60 seconds}
    },
  });

  return response;
}

export async function getDramaByGenre(
  request: Pick<MovieListRequest, "isAPKvalid"> & { genre1: string },
) {
  const params = buildParams<
    Pick<MovieListRequest, "isAPKvalid"> & { genre1: string }
  >(request);

  const response = await serverFetch<MovieListResponse>({
    path: "/drakor/phalcon/api/get_drama_by_genre/v2/",
    opts: {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      next: {
        revalidate: TIME.ONE_DAY,
        tags: ["dramaByGenre", request.genre1],
      }, // default to 60 seconds}
    },
  });

  const data = {
    ...response,
    categories: response.categories.filter((category) => category.cid !== 1),
  };

  return data as MovieListResponse;
}
