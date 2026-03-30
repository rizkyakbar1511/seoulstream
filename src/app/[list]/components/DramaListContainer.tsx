import Pagination from "@/app/[list]/components/Pagination";
import SelectItemsPerPage from "@/app/[list]/components/SelectItemsPerPage";
import DramaList from "@/features/drama/components/DramaList";
import {
  fetchDramaList,
  fetchNewDramaList,
  fetchOngoingDramas,
} from "@/features/drama/server/service";

interface DramaListProps {
  page?: string | string[];
  limit?: string | string[];
  list: string;
}

export default async function DramaListContainer({
  page,
  limit,
  list,
}: DramaListProps) {
  const fetchMap = {
    all: fetchDramaList,
    ongoing: fetchOngoingDramas,
    "new-releases": fetchNewDramaList,
  };

  const response = await fetchMap[list as keyof typeof fetchMap]({
    page: Number(page ?? "1"),
    count: Number(limit ?? "20"),
    isAPKvalid: true,
  });

  if (page && Number(page) > response.meta.totalPages) {
    return (
      <div className="absolute translate-y-1/2 top-1/2 left-1/2 -translate-x-1/2">
        Page not found
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center sm:justify-between flex-wrap mt-4">
        <div className="text-muted-foreground text-sm flex items-center gap-1">
          <span>showing</span>{" "}
          <SelectItemsPerPage triggerClassName="!h-auto p-1" /> <span>of</span>{" "}
          {response.meta.totalItems} <span>results</span>
        </div>
        <Pagination
          className={{ root: "mx-auto w-auto xs:mx-0 max-sm:py-5" }}
          basePath={`/${list}`}
          currentPage={response.meta.currentPage}
          totalPages={response.meta.totalPages}
          limitPerPage={Number(limit)}
        />
      </div>
      <DramaList data={response} variant="grid" />
    </>
  );
}
