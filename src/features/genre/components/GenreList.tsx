import { fetchGenreList } from "../service";
import GenreCollapsible from "./GenreCollapsible";

export default async function GenreList() {
  const genres = await fetchGenreList();

  return (
    <section className="space-y-3">
      <div className="mb-5 flex flex-col after:relative after:bg-primary after:mt-1 after:w-10 after:h-1.5 after:rounded-lg after:block">
        <h2 className="font-semibold text-xl">Browse by Genre</h2>
        <p className="text-sm text-muted-foreground">
          Pick a genre to see everything in it
        </p>
      </div>
      <GenreCollapsible genres={genres} />
    </section>
  );
}