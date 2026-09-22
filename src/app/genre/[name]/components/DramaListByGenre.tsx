import DramaList from "@/features/drama/components/DramaList";
import { fetchDramaByGenre } from "@/features/drama/server/service";
import GenreSelect from "@/features/genre/components/GenreSelect";

interface DramaListByGenreProps {
  genre: string;
}

export default async function DramaListByGenre({
  genre,
}: DramaListByGenreProps) {
  const response = await fetchDramaByGenre({ genre1: genre, isAPKvalid: true });

  return (
    <>
      <div className="flex justify-between">
        <div>
          <h3 className="text-2xl font-semibold">{genre} dramas</h3>
          <p className="text-sm text-muted-foreground">
            {response.meta.totalItems} Results
          </p>
        </div>
        <GenreSelect currentGenre={genre} />
      </div>
      <DramaList data={response} variant="grid" />
    </>
  );
}