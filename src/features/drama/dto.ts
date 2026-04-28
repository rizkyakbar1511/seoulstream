export interface DramaListRequestDTO {
  page: number;
  count: number;
  isAPKvalid: boolean;
}

export interface DramaCategoryDTO {
  cid: number;
  category_name: string;
  category_type: string;
  count_anime: string;
  img_url: string;
  days?: number;
  rating: string;
  years: number;
  total_views: number;
  ongoing?: number;
  genre?: string;
  created?: string;
  updated?: string;
  new_episode?: string;
}

export interface DramaListResponseDTO {
  status: string;
  count: number;
  count_total: number;
  pages: number;
  categories: DramaCategoryDTO[];
}

export interface DramaEpisodeDTO {
  channel_id: number;
  category_id: number;
  channel_name: string;
  category_name: string;
  category_type: string;
  created: string;
  count_view: string;
  img_url: string;
  is_hd_available: boolean;
  ongoing: number;
  rating: string;
  years: number;
  genre: string;
}

export interface DramaCategoryPostsRequestDTO extends DramaListRequestDTO {
  id: number;
}

export interface DramaCategoryPostsResponseDTO {
  status: string;
  count: number;
  count_total: number;
  pages: number;
  category: DramaCategoryDTO;
  posts: DramaEpisodeDTO[];
}

export interface DramaDetailRequestDTO {
  channel_id: number;
  isAPKvalid: boolean;
}

export interface DramaDetailResponseDTO {
  status: string;
  channel_description: string;
  channel_name: string;
  channel_id: number;
  category_id: string;
  channel_url: string;
  channel_url_hd: string;
  is_hd_available: boolean;
  embed_url: string;
  download_url: string;
}

export interface DramaCategoryTypeDTO {
  id: number;
  name: string;
  isactive: number;
}

export interface DramaCategoryTypeResponseDTO {
  status: string;
  count_total: number;
  category_type: DramaCategoryTypeDTO[];
}

export interface DramaGenreDTO {
  id: number;
  name: string;
}

export interface DramaGenreResponseDTO {
  status: string;
  genre: DramaGenreDTO[];
}

export interface DramaSearchRequestDTO {
  pilihan: string;
  search: string;
  page: number;
  count: number;
  isAPKvalid: boolean;
}

export interface DramaSearchResponseDTO {
  status: string;
  count: number;
  count_total: number;
  pages: number;
  categories: DramaCategoryDTO[];
}

export interface DramaByGenreRequestDTO {
  genre1: string;
  isAPKvalid: boolean;
}
