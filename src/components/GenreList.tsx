import { getGenreList } from "@/lib/api/server";
import GenreCarousel from "./GenreCarousel";

interface GenreListProps {
    currentGenre?: string;
}

export default async function GenreList({ currentGenre }: GenreListProps) {
    const response = await getGenreList();
    const genres = response.genre.filter((genre) => Boolean(!genre.genre_status_hide));

    return <GenreCarousel genres={genres} currentGenre={currentGenre} />
}