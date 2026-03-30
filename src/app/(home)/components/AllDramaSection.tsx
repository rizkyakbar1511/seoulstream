import DramaSection from "@/features/drama/components/DramaSection";
import { fetchDramaList } from "@/features/drama/server/service";

export default async function AllDramaSection() {
  const data = await fetchDramaList({ page: 1, count: 20, isAPKvalid: true });
  return (
    <DramaSection
      title="All Dramas"
      data={data}
      viewAllHref="/all"
      variant="carousel"
    />
  );
}
