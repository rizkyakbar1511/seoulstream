import "server-only";
import type {
  DramaByGenreRequestDTO,
  DramaCategoryPostsRequestDTO,
  DramaDetailRequestDTO,
  DramaListRequestDTO,
  DramaSearchRequestDTO,
} from "../dto";
import {
  getDramaByGenre,
  getDramaCategoryPosts,
  getDramaCategoryTypes,
  getDramaDetail,
  getDramaList,
  getNewDramaPosts,
  getOngoingDramas,
  searchDramas,
} from "./api";
import {
  mapDrama,
  mapDramaCategoryTypeList,
  mapDramaDetail,
  mapEpisode,
} from "../mapper";
import {
  createVideoToken,
  isHlsStreamUrl,
} from "@/features/video-player/utils";

export async function fetchDramaList(request: DramaListRequestDTO) {
  const res = await getDramaList(request);

  const filtered = res.categories.filter((item) => item.cid !== 1);

  return {
    dramas: filtered.map(mapDrama),
    meta: {
      perPage: res.count,
      totalItems: res.count_total,
      currentPage: res.pages,
      totalPages: Math.ceil(res.count_total / res.count),
    },
  };
}

export async function fetchDramaByGenre(request: DramaByGenreRequestDTO) {
  const res = await getDramaByGenre(request);
  const filtered = res.categories.filter((item) => item.cid !== 1);

  return {
    dramas: filtered.map(mapDrama),
    meta: {
      perPage: res.count,
      totalItems: res.count_total,
      currentPage: res.pages,
      totalPages: Math.ceil(res.count_total / res.count),
    },
  };
}

export async function fetchNewDramaList(request: DramaListRequestDTO) {
  const res = await getNewDramaPosts(request);
  const filtered = res.categories.filter((item) => item.cid !== 1);

  return {
    dramas: filtered.map(mapDrama),
    meta: {
      perPage: res.count,
      totalItems: res.count_total,
      currentPage: res.pages,
      totalPages: Math.ceil(res.count_total / res.count),
    },
  };
}

export async function fetchOngoingDramas(request: DramaListRequestDTO) {
  const res = await getOngoingDramas(request);

  return {
    dramas: res.categories.map(mapDrama),
    meta: {
      perPage: res.count,
      totalItems: res.count_total,
      currentPage: res.pages,
      totalPages: Math.ceil(res.count_total / res.count),
    },
  };
}

export async function fetchDramaCategoryPosts(
  request: DramaCategoryPostsRequestDTO,
) {
  const res = await getDramaCategoryPosts(request);

  const drama = mapDrama(res.category);
  const episodes = res.posts.map(mapEpisode);

  return {
    drama,
    episodes,
    meta: {
      perPage: res.count,
      totalItems: res.count_total,
      currentPage: res.pages,
      totalPages: Math.ceil(res.count_total / res.count),
    },
  };
}

export async function fetchDramaDetail(request: DramaDetailRequestDTO) {
  const res = await getDramaDetail(request);
  return mapDramaDetail(res);
}

export async function fetchDramaWatchData({
  id,
  channel_id,
  ...rest
}: {
  id: number;
  channel_id?: number;
} & DramaListRequestDTO) {
  const postsRes = await getDramaCategoryPosts({
    id,
    ...rest,
  });

  const episodes = postsRes.posts.map(mapEpisode);

  const currentEpisodeId = channel_id ?? episodes[0]?.id;

  const currentIndex = episodes.findIndex((e) => e.id === currentEpisodeId);

  const drama = {
    ...mapDrama(postsRes.category),
    title: episodes[currentIndex]?.title,
  };

  const currentEpisode = episodes[currentIndex];
  const prevEpisode = currentIndex > 0 ? episodes[currentIndex - 1] : null;

  const nextEpisode =
    currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null;

  const detailRes = await getDramaDetail({
    channel_id: currentEpisode.id,
    isAPKvalid: true,
  });

  const detail = mapDramaDetail(detailRes);

  const video = {
    sd: await createVideoToken(detail.video.sd),
    hd: detail.video.hd ? await createVideoToken(detail.video.hd) : undefined,
    isHls: isHlsStreamUrl(detail.video.hd || detail.video.sd),
  };

  return {
    drama,
    episodes,
    currentEpisode,
    prevEpisode,
    nextEpisode,
    video,
    descriptionHtml: detail.descriptionHtml,
    isHdAvailable: detail.isHdAvailable,
    meta: {
      perPage: postsRes.count,
      totalItems: postsRes.count_total,
      currentPage: postsRes.pages,
      totalPages: Math.ceil(postsRes.count_total / postsRes.count),
    },
  };
}

export async function fetchDramaSearch(request: DramaSearchRequestDTO) {
  const res = await searchDramas(request);

  return {
    dramas: res.categories.filter((item) => item.cid !== 1).map(mapDrama),
    meta: {
      perPage: res.count,
      totalItems: res.count_total,
      currentPage: res.pages,
      totalPages: Math.ceil(res.count_total / res.count),
    },
  };
}

export async function fetchDramaCategoryTypes() {
  const res = await getDramaCategoryTypes();
  return mapDramaCategoryTypeList(res);
}
