import { getGenreList } from "@/features/genre/api";
import GenreCarousel from "./GenreCarousel";
import { fetchGenreList } from "../service";

interface GenreListProps {
  currentGenre?: string;
}

export default async function GenreList({ currentGenre }: GenreListProps) {
  const genres = await fetchGenreList();

  return <GenreCarousel genres={genres} currentGenre={currentGenre} />;
}
