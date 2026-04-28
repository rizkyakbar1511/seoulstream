export enum DramaCategoryTypeEnum {
  KOREAN_SERIES = "Serial Drama Korea",
  THAILAND_SERIES = "Serial Drama Thailand",
  JAPAN_SERIES = "Serial Drama Jepang",
  MOVIE = "Movie",
  VARIETY_SHOW = "Variety Show",
}

export interface Drama {
  id: number;
  title: string;
  poster: string;
  rating: number;
  year: number;
  episodes: number;
  views: number;
  type: string;
  ongoing: boolean;
  genre?: string;
  latestEpisode?: string;
  updatedAt?: string;
}

export interface VideoSource {
  sd: string;
  hd?: string;
  isHls?: boolean;
}

export interface DramaDetail {
  episodeId: number;
  title: string;
  video: VideoSource;
  isHdAvailable: boolean;
  descriptionHtml: string;
}

export interface PaginationMeta {
  perPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

export interface Episode {
  id: number;
  category_id: number;
  title: string;
  createdAt: string;
  views: number;
  poster: string;
  isHdAvailable: boolean;
}

export interface DramaListResult {
  dramas: Drama[];
  meta: PaginationMeta;
}

export interface DramaWithEpisodesResult {
  drama: Drama;
  episodes: Episode[];
  meta: PaginationMeta;
}

export interface DramaCategoryType {
  id: number;
  name: string;
  isActive: boolean;
}

export interface DramaCategoryTypeList {
  items: DramaCategoryType[];
  total: number;
}

export interface Credits {
  cast: {
    id: string;
    name: string;
    character: string;
    avatar: string;
  }[];
  crew: {
    id: string;
    name: string;
    job: string;
    avatar: string;
  }[];
}
