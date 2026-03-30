import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { DramaListResult } from "../types";
import DramaCard from "./DramaCard";

interface DramaListProps {
  data: DramaListResult;
  variant: "grid" | "carousel";
}

export default function DramaList({ data, variant }: DramaListProps) {
  if (variant === "carousel") {
    return (
      <Carousel
        className="w-full"
        opts={{
          dragFree: true,
          duration: 20,
          slidesToScroll: 1,
          watchDrag: true,
        }}
      >
        <CarouselContent className="pb-2 touch-pan-y">
          {data.dramas.map((drama) => (
            <CarouselItem
              className="basis-2/3 sm:basis-1/3 lg:basis-1/5"
              key={drama.id}
            >
              <DramaCard data={drama} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious />
            <CarouselNext /> */}
      </Carousel>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 container gap-4">
      {data.dramas.map((drama) => (
        <DramaCard key={drama.id} data={drama} />
      ))}
    </div>
  );
}
