import MovieLists from "@/components/movie/MovieLists";
import Pagination from "@/components/Pagination";
import SelectItemsPerPage from "@/components/SelectItemsPerPage";
import { getAllDrama, getNewPostsDrama, getOngoingDrama } from "@/lib/api/server";

interface DramaListProps {
    page?: string,
    limit?: string,
    list: string
}

export default async function DramaList({ page, limit, list }: DramaListProps) {
    const fetchMap = {
        "all": getAllDrama,
        "ongoing": getOngoingDrama,
        "new-releases": getNewPostsDrama
    }

    const response = await fetchMap[list as keyof typeof fetchMap]({ page: Number(page ?? 1), count: Number(limit), isAPKvalid: true });
    const pageSize = response.count || Number(limit);
    const totalPages = Math.max(1, Math.ceil((response.count_total ?? 0) / pageSize));

    if (page && Number(page) > totalPages) {
        return <div className="absolute translate-y-1/2 top-1/2 left-1/2 -translate-x-1/2">Page not found</div>
    }

    return <>
        <div className="flex items-center justify-center sm:justify-between flex-wrap mt-4">
            <div className="text-muted-foreground text-sm flex items-center gap-1"><span>showing</span> <SelectItemsPerPage triggerClassName="!h-auto p-1" /> <span>of</span> {response.count_total} <span>results</span></div>
            <Pagination
                className={{ root: "mx-auto w-auto xs:mx-0 max-sm:py-5" }}
                basePath={`/${list}`}
                currentPage={response.pages}
                totalPages={totalPages}
                limitPerPage={Number(limit)}
            />
        </div>
        <MovieLists data={response} />
    </>
}