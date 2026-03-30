import { Suspense } from "react";
import DramaListByGenre from "./components/DramaListByGenre";
import DramaSectionLoading from "@/features/drama/components/DramaSectionLoading";
import GenreList from "@/features/genre/components/GenreList";
import { LoaderIcon } from "lucide-react";

export default async function GenrePage({
  params,
}: {
  params: Promise<{ [key: string]: string }>;
}) {
  const genre = (await params).name;

  return (
    <main className="space-y-3 container mx-auto p-4 sm:p-5">
      <Suspense fallback={<LoaderIcon className="animate-spin size-4" />}>
        <GenreList currentGenre={genre} />
      </Suspense>
      <Suspense
        fallback={
          <DramaSectionLoading skeletonContentLength={40} variant="grid" />
        }
      >
        <DramaListByGenre genre={genre} />
      </Suspense>
    </main>
  );
}
