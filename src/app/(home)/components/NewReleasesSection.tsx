import MovieSection from "@/components/movie/MovieSection";
import { getNewPostsDrama } from "@/lib/api/server";

export default async function NewReleasesSection() {
    const data = await getNewPostsDrama({ page: 1, count: 20, isAPKvalid: true });
    return <MovieSection title="New Releases" data={data} href="/new-releases" carouselList />
}