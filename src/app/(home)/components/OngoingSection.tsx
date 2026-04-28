import DramaSection from "@/features/drama/components/DramaSection";
import { fetchOngoingDramas } from "@/features/drama/server/service";

export default async function OngoingSection() {
  const data = await fetchOngoingDramas({
    page: 1,
    count: 20,
    isAPKvalid: true,
  });
  return (
    <DramaSection
      title="Ongoing"
      data={data}
      viewAllHref="/ongoing"
      variant="carousel"
    />
  );
}
