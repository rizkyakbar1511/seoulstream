import DramaList from "@/features/drama/components/DramaList";
import { fetchDramaByGenre } from "@/features/drama/server/service";

interface DramaListByGenreProps {
  genre: string;
}

export default async function DramaListByGenre({
  genre,
}: DramaListByGenreProps) {
  const response = await fetchDramaByGenre({ genre1: genre, isAPKvalid: true });

  return (
    <>
      <h3>
        {response.meta.totalItems} Results for {genre}
      </h3>
      <DramaList data={response} variant="grid" />
    </>
  );
}
