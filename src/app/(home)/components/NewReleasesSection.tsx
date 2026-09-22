import DramaSection from "@/features/drama/components/DramaSection";
import { fetchNewDramaList } from "@/features/drama/server/service";

export default async function NewReleasesSection() {
  const data = await fetchNewDramaList({
    page: 1,
    count: 10,
    isAPKvalid: true,
  });
  return (
    <DramaSection
      title="New Releases"
      data={data}
      viewAllHref="/new-releases"
      variant="carousel"
    />
  );
}
