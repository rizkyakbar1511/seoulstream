import type {
  DramaCategoryDTO,
  DramaCategoryTypeDTO,
  DramaCategoryTypeResponseDTO,
  DramaDetailResponseDTO,
  DramaEpisodeDTO,
} from "./dto";
import { TmdbCreditsResponseDTO } from "./server/api/tmdb/dto";
import type {
  Credits,
  Drama,
  DramaCategoryType,
  DramaCategoryTypeList,
  DramaDetail,
  Episode,
} from "./types";

export function mapDrama(dto: DramaCategoryDTO): Drama {
  return {
    id: dto.cid,
    title: dto.category_name,
    poster: dto.img_url,
    rating: Number(dto.rating),
    year: dto.years,
    episodes: Number(dto.count_anime),
    views: dto.total_views,
    type: dto.category_type,
    ongoing: Boolean(dto.ongoing),
    genre: dto.genre,
    latestEpisode: dto.new_episode,
    updatedAt: dto.updated,
  };
}

export function mapEpisode(dto: DramaEpisodeDTO): Episode {
  return {
    id: dto.channel_id,
    category_id: dto.category_id,
    title: dto.channel_name,
    createdAt: dto.created,
    views: Number(dto.count_view),
    poster: dto.img_url,
    isHdAvailable: dto.is_hd_available,
  };
}

export function mapDramaDetail(dto: DramaDetailResponseDTO): DramaDetail {
  return {
    episodeId: dto.channel_id,
    title: dto.channel_name,
    video: {
      sd: dto.channel_url,
      hd: dto.is_hd_available ? dto.channel_url_hd : undefined,
    },
    isHdAvailable: dto.is_hd_available,
    descriptionHtml: dto.channel_description,
  };
}

export function mapDramaCategoryType(
  dto: DramaCategoryTypeDTO,
): DramaCategoryType {
  return {
    id: dto.id,
    name: dto.name,
    isActive: Boolean(dto.isactive),
  };
}

export function mapDramaCategoryTypeList(
  dto: DramaCategoryTypeResponseDTO,
): DramaCategoryTypeList {
  return {
    items: dto.category_type.map(mapDramaCategoryType),
    total: Number(dto.count_total),
  };
}

export function mapDramaCredits(dto: TmdbCreditsResponseDTO): Credits {
  return {
    cast: dto.cast.map((c) => ({
      id: c.credit_id,
      name: c.name,
      character: c.character,
      avatar: c.profile_path ?? "",
    })),
    crew: dto.crew.map((c) => ({
      id: c.credit_id,
      name: c.name,
      job: c.job,
      avatar: c.profile_path ?? "",
    })),
  };
}
