import { Suspense } from "react";
import AllDramaSection from "@/app/(home)/components/AllDramaSection";
import NewReleasesSection from "@/app/(home)/components/NewReleasesSection";
import OngoingSection from "@/app/(home)/components/OngoingSection";
import { LoaderIcon } from "lucide-react";
import GenreList from "@/features/genre/components/GenreList";
import DramaSectionLoading from "@/features/drama/components/DramaSectionLoading";
import ContinueWatchList from "@/features/video-player/components/ContinueWatchList";

export default function Home() {
  return (
    <main className="container mx-auto p-4 sm:p-5 overflow-x-clip">
      <section className="hero">
        <h1 className="font-bold text-4xl sm:text-5xl">
          <span className="text-primary">Seoul</span>Stream
        </h1>
        <p className="sm:text-xl md:text-2xl">
          Discover Korean dramas, variety shows, and entertainment content all
          in one place
        </p>
      </section>
      <div className="space-y-8">
        <Suspense fallback={<LoaderIcon className="animate-spin size-4" />}>
          <ContinueWatchList />
        </Suspense>
        <Suspense fallback={<LoaderIcon className="animate-spin size-4" />}>
          <GenreList />
        </Suspense>
        <Suspense fallback={<DramaSectionLoading variant="carousel" />}>
          <NewReleasesSection />
        </Suspense>
        <Suspense fallback={<DramaSectionLoading variant="carousel" />}>
          <OngoingSection />
        </Suspense>
        <Suspense fallback={<DramaSectionLoading variant="carousel" />}>
          <AllDramaSection />
        </Suspense>
        {/** Commented for now because the API didnt had limit filter, its gonna show a bunch of dramas */}
        {/*<Suspense fallback={<DramaSectionLoading variant="carousel" />}>
             <ByGenreSection genre="Action" />
           </Suspense>
           <Suspense fallback={<DramaSectionLoading variant="carousel" />}>
             <ByGenreSection genre="Adventure" />
           </Suspense>*/}
      </div>
    </main>
  );
}
