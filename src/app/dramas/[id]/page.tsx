import { Suspense } from "react";
import DramaDetails from "@/app/dramas/[id]/components/DramaDetails";
import DramaDetailsLoading from "@/app/dramas/[id]/components/DramaDetailsLoading";

export default async function DramasPage({
  params,
  searchParams,
}: PageProps<"/dramas/[id]">) {
  const { id } = await params;
  const { channel_id } = await searchParams;

  return (
    <Suspense fallback={<DramaDetailsLoading />}>
      <DramaDetails id={id} channel_id={channel_id} />
    </Suspense>
  );
}
