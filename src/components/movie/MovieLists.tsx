import type { MovieListResponse } from "@/types";
import MovieCard from "./MovieCard";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

interface MovieListsProps {
    data: MovieListResponse;
    carousel?: boolean;
}

export default function MovieLists({ data, carousel }: MovieListsProps) {
    if (carousel) {
        return <Carousel className="w-full" opts={{
            dragFree: true,
            slidesToScroll: 1,
        }}>
            <CarouselContent className="pb-2">
                {data.categories.map((category) => (
                    <CarouselItem className="basis-1/2 sm:basis-1/3 lg:basis-1/5" key={category.cid}>
                        <MovieCard data={category} />
                    </CarouselItem>
                ))}
            </CarouselContent>
            {/* <CarouselPrevious />
            <CarouselNext /> */}
        </Carousel>
    }

    return <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 container gap-4">
        {data.categories.map((category) => (
            <MovieCard key={category.cid} data={category} />
        ))}
    </div>
}