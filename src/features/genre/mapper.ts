import type { GenreDTO, GenreListResponseDTO } from "./dto";
import type { Genre, GenreList } from "./types";

export function mapGenre(dto: GenreDTO): Genre {
  return {
    id: dto.genre_id,
    label: dto.genre_name,
    value: dto.genre_id,
  };
}

export function mapGenreList(dto: GenreListResponseDTO): GenreList {
  return {
    items: dto.genre.filter((g) => g.genre_status_hide === 0).map(mapGenre),
    total: Number(dto.count_total),
  };
}
