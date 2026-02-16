import MovieSection from "@/components/movie/MovieSection";
import { getAllDrama } from "@/lib/api/server";

export default async function AllDramaSection() {
    const data = await getAllDrama({ page: 1, count: 20, isAPKvalid: true });
    return <MovieSection title="All Dramas" data={data} href="/all" carouselList />
}