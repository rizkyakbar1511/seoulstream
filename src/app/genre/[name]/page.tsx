import { Suspense } from "react";
import DramaListByGenre from "./components/DramaListByGenre";
import DramaSectionLoading from "@/features/drama/components/DramaSectionLoading";

export default async function GenrePage({
  params,
}: PageProps<"/genre/[name]">) {
  const genre = (await params).name;

  return (
    <main className="space-y-3 container mx-auto p-4 sm:p-5">
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