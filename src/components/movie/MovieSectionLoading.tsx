import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface MovieSectionLoadingProps {
    skeletonContentLength?: number;
    carousel?: boolean
}

export default function MovieSectionLoading({ skeletonContentLength = 10, carousel }: MovieSectionLoadingProps) {
    return <section className="space-y-3 mb-5">
        <div className="flex justify-between items-center">
            <div className="font-bold text-2xl">
                <Skeleton className="h-7 w-32" />
            </div>
            <Skeleton className="h-5 w-16" />
        </div>
        <div>
            {/* Skeletons for MovieLists items */}
            <div className={cn("grid gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-7", carousel && "flex overflow-hidden")}>
                {Array.from({ length: skeletonContentLength }).map((_, i) => (
                    <Skeleton key={`skeleton-${i}-${Math.random()}`} className={cn("h-72 basis-1/2 sm:basis-1/3 lg:basis-[14%] rounded-lg shrink-0", carousel && "w-28")} />
                ))}
            </div>
        </div>
    </section>
}