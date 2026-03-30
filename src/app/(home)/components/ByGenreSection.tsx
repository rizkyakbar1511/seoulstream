import DramaSection from "@/features/drama/components/DramaSection";
import { fetchDramaByGenre } from "@/features/drama/server/service";

interface ByGenreSectionProps {
  genre: string;
}

export default async function ByGenreSection({ genre }: ByGenreSectionProps) {
  const data = await fetchDramaByGenre({ genre1: genre, isAPKvalid: true });

  return (
    <DramaSection
      title={genre}
      data={data}
      viewAllHref={`/genre/${genre}`}
      variant="carousel"
    />
  );
}
