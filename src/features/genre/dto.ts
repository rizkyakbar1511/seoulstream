export interface GenreDTO {
  genre_id: number;
  genre_name: string;
  genre_status_hide: number;
}

export interface GenreListResponseDTO {
  status: string;
  count_total: string;
  genre: GenreDTO[];
}
