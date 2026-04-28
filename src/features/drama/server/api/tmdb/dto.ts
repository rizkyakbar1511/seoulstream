export type TmdbSearchType =
  | "collection"
  | "company"
  | "keyword"
  | "movie"
  | "multi"
  | "person"
  | "tv";

export type TmdbSearchRequestDTO<T extends TmdbSearchType> =
  T extends "collection"
    ? {
        query: string;
        include_adult?: boolean;
        language?: string;
        page?: number;
        region?: string;
      }
    : T extends "company"
      ? {
          query: string;
          page?: number;
        }
      : T extends "keyword"
        ? {
            query: string;
            page?: number;
          }
        : T extends "movie"
          ? {
              query: string;
              include_adult?: boolean;
              language?: string;
              primary_release_year: string;
              page?: number;
              region?: string;
              year?: string;
            }
          : T extends "multi"
            ? {
                query: string;
                include_adult?: boolean;
                language?: string;
                page?: number;
              }
            : T extends "person"
              ? {
                  query: string;
                  include_adult?: boolean;
                  language?: string;
                  page?: number;
                }
              : T extends "tv"
                ? {
                    query: string;
                    first_air_date_year?: number;
                    include_adult?: boolean;
                    language?: string;
                    page?: number;
                    year?: number;
                  }
                : never;

export type CollectionResult = {
  adult: boolean;
  backdrop_path: string;
  id: number;
  original_language: string;
  original_name: string;
  overview: string;
  poster_path: string;
};

export type CompanyResult = {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
};

export type KeywordResult = {
  id: number;
  name: string;
};

export type MovieResult = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: false;
  vote_average: number;
  vote_count: number;
};

export type MultiResult = {
  adult: boolean;
  backdrop_path: string;
  id: number;
  title: string;
  original_language: string;
  original_title: string;
  overview: string;
  poster_path: string;
  media_type: string;
  genre_ids: number[];
  popularity: number;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type PersonResult = {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  known_for: {
    adult: boolean;
    backdrop_path: string;
    id: number;
    title: string;
    original_language: string;
    original_title: string;
    overview: string;
    poster_path: string;
    media_type: string;
    genre_ids: number[];
    popularity: number;
    release_date: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
  }[];
};

export type TVResult = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
};

export type TmdbSearchResponseDTO<T extends TmdbSearchType> =
  T extends "collection"
    ? {
        page: number;
        results: CollectionResult[];
        total_pages: number;
        total_results: number;
      }
    : T extends "company"
      ? {
          page: number;
          results: CompanyResult[];
          total_pages: number;
          total_results: number;
        }
      : T extends "keyword"
        ? {
            page: number;
            results: KeywordResult[];
            total_pages: number;
            total_results: number;
          }
        : T extends "movie"
          ? {
              page: number;
              results: MovieResult[];
              total_pages: number;
              total_results: number;
            }
          : T extends "multi"
            ? {
                page: number;
                results: MultiResult[];
                total_pages: number;
                total_results: number;
              }
            : T extends "person"
              ? {
                  page: number;
                  results: PersonResult[];
                  total_pages: number;
                  total_results: number;
                }
              : T extends "tv"
                ? {
                    page: number;
                    results: TVResult[];
                    total_pages: number;
                    total_results: number;
                  }
                : never;

export type TmdbCreditsRequestDTO = {
  id: number;
  type: "movie" | "tv";
  language?: string;
};

export interface Cast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path?: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface Crew {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path?: string;
  credit_id: string;
  department: string;
  job: string;
}

export type TmdbCreditsResponseDTO = {
  id: number;
  cast: Cast[];
  crew: Crew[];
};
