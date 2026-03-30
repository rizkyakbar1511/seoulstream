import { TIME } from "@/constants";
import { config } from "@/lib/config";
import { http } from "@/lib/http";
import type { GenreListResponseDTO } from "./dto";

export function getGenreList() {
  return http<GenreListResponseDTO>({
    path: `${config.API_BASE_PATH}${config.API_DRAMA_GENRE_LIST}`,
    opts: {
      next: { revalidate: TIME.ONE_DAY, tags: ["genre:list"] }, // default to 60 seconds}
    },
  });
}
