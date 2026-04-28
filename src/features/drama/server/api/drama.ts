import { TIME } from "@/constants";
import { config } from "@/lib/config";
import { http } from "@/lib/http";
import { buildParams } from "@/lib/utils";
import type {
  DramaByGenreRequestDTO,
  DramaCategoryPostsRequestDTO,
  DramaCategoryPostsResponseDTO,
  DramaCategoryTypeResponseDTO,
  DramaDetailRequestDTO,
  DramaDetailResponseDTO,
  DramaListRequestDTO,
  DramaListResponseDTO,
  DramaSearchRequestDTO,
  DramaSearchResponseDTO,
} from "@/features/drama/dto";

export function getDramaList(request: DramaListRequestDTO) {
  const params = buildParams(request);

  return http<DramaListResponseDTO>({
    path: `${config.API_BASE_PATH}${config.API_DRAMA_ALL}`,
    opts: {
      method: "POST",
      body: params.toString(),
      next: { revalidate: TIME.ONE_DAY, tags: ["drama:list"] }, // default to 60 seconds}
    },
  });
}

export function getNewDramaPosts(request: DramaListRequestDTO) {
  const params = buildParams(request);

  return http<DramaListResponseDTO>({
    path: `${config.API_BASE_PATH}${config.API_DRAMA_NEW_POSTS}`,
    opts: {
      method: "POST",
      body: params.toString(),
      next: { revalidate: TIME.ONE_DAY, tags: ["drama:new"] }, // default to 60 seconds}
    },
  });
}

export function getOngoingDramas(request: DramaListRequestDTO) {
  const params = buildParams(request);

  return http<DramaListResponseDTO>({
    path: `${config.API_BASE_PATH}${config.API_DRAMA_ONGOING}`,
    opts: {
      method: "POST",
      body: params.toString(),
      next: { revalidate: TIME.ONE_DAY, tags: ["drama:ongoing"] }, // default to 60 seconds}
    },
  });
}

export function getDramaCategoryPosts(request: DramaCategoryPostsRequestDTO) {
  const params = buildParams(request);

  return http<DramaCategoryPostsResponseDTO>({
    path: `${config.API_BASE_PATH}${config.API_DRAMA_CATEGORY_POSTS}`,
    opts: {
      method: "POST",
      body: params.toString(),
      next: { revalidate: TIME.ONE_DAY, tags: ["drama:category-posts"] }, // default to 60 seconds}
    },
  });
}

export function getDramaDetail(request: DramaDetailRequestDTO) {
  const params = buildParams(request);

  return http<DramaDetailResponseDTO>({
    path: `${config.API_BASE_PATH}${config.API_DRAMA_POST_DESCRIPTION}`,
    opts: {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      next: { revalidate: TIME.ONE_DAY, tags: ["drama:detail"] }, // default to 60 seconds}
    },
  });
}

export function searchDramas(request: DramaSearchRequestDTO) {
  const params = buildParams(request);

  return http<DramaSearchResponseDTO>({
    path: `${config.API_BASE_PATH}${config.API_DRAMA_SEARCH}`,
    opts: {
      method: "POST",
      body: params.toString(),
      next: {
        revalidate: TIME.ONE_DAY,
        tags: [
          "drama:search",
          `drama:search:${request.search}:${request.page}:${request.pilihan}`,
        ],
      }, // default to 60 seconds}
    },
  });
}

export async function getDramaCategoryTypes() {
  const response = await http<DramaCategoryTypeResponseDTO>({
    path: `${config.API_BASE_PATH}${config.API_DRAMA_CATEGORY_TYPE_LIST}`,
    opts: {
      next: { revalidate: TIME.ONE_DAY, tags: ["drama:category-types"] }, // default to 60 seconds}
    },
  });

  return response;
}

export function getDramaByGenre(request: DramaByGenreRequestDTO) {
  const params = buildParams(request);
  return http<DramaListResponseDTO>({
    path: `${config.API_BASE_PATH}${config.API_DRAMA_BY_GENRE}`,
    opts: {
      method: "POST",
      body: params.toString(),
      next: {
        revalidate: TIME.ONE_DAY,
        tags: [`drama:by-genre:${request.genre1}`],
      }, // default to 60 seconds}
    },
  });
}
