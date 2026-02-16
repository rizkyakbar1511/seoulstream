import MovieLists from "@/components/movie/MovieLists";
import { getDramaByGenre } from "@/lib/api/server";

interface DramaListByGenreProps {
    genre: string
}

export default async function DramaListByGenre({ genre }: DramaListByGenreProps) {
    const response = await getDramaByGenre({ genre1: genre, isAPKvalid: true });

    return <>
        <h3>{response.count_total} Results for {genre}</h3>
        <MovieLists data={response} />
    </>
}