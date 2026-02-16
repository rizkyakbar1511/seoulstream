import MovieSection from "@/components/movie/MovieSection";
import { getOngoingDrama } from "@/lib/api/server";

export default async function OngoingSection() {
    const data = await getOngoingDrama({ page: 1, count: 20, isAPKvalid: true });
    return <MovieSection title="Ongoing" data={data} href="/ongoing" carouselList />
}