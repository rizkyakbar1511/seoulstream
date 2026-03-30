import { Suspense } from "react";
import AllDramaSection from "@/app/(home)/components/AllDramaSection";
import NewReleasesSection from "@/app/(home)/components/NewReleasesSection";
import OngoingSection from "@/app/(home)/components/OngoingSection";
import { LoaderIcon } from "lucide-react";
import GenreList from "@/features/genre/components/GenreList";
import ByGenreSection from "./components/ByGenreSection";
import DramaSectionLoading from "@/features/drama/components/DramaSectionLoading";

export default function Home() {
  return (
    <main className="container mx-auto p-4 sm:p-5">
      <section className="flex flex-col items-center text-center py-20">
        <h1 className="font-bold text-4xl sm:text-5xl">
          <span className="text-primary">Seoul</span>Stream
        </h1>
        <p className="sm:text-xl md:text-2xl">
          Discover Korean dramas, variety shows, and entertainment content all
          in one place
        </p>
      </section>
      <div className="space-y-8">
        <Suspense fallback={<DramaSectionLoading variant="carousel" />}>
          <NewReleasesSection />
        </Suspense>
        <Suspense fallback={<DramaSectionLoading variant="carousel" />}>
          <OngoingSection />
        </Suspense>
        <Suspense fallback={<DramaSectionLoading variant="carousel" />}>
          <AllDramaSection />
        </Suspense>
        <Suspense fallback={<LoaderIcon className="animate-spin size-4" />}>
          <GenreList />
        </Suspense>
        <Suspense fallback={<DramaSectionLoading variant="carousel" />}>
          <ByGenreSection genre="Action" />
        </Suspense>
        <Suspense fallback={<DramaSectionLoading variant="carousel" />}>
          <ByGenreSection genre="Adventure" />
        </Suspense>
      </div>
    </main>
  );
}
