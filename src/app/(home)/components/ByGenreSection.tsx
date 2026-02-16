import MovieSection from "@/components/movie/MovieSection";
import { getDramaByGenre } from "@/lib/api/server";

interface ByGenreSectionProps {
    genre: string;
}

export default async function ByGenreSection({ genre }: ByGenreSectionProps) {
    const response = await getDramaByGenre({ genre1: genre, isAPKvalid: true });

    const data = {
        ...response,
        categories: response.categories.filter((category) => category.cid !== 1).slice(0, 20),
    }

    return <MovieSection title={genre} data={data} href={`/genre/${genre}`} carouselList />
}