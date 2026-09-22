"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useContinueWatchList } from "../hooks/useContinueWatchList";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  XIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCarouselControl } from "@/hooks/useCarouselControl";

function ContinueWatchListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <section className="space-y-3">
      <div className="mb-5 flex flex-col after:relative after:bg-primary after:mt-1 after:w-10 after:h-1.5 after:rounded-lg after:block">
        <Skeleton className="h-7 w-44" />
      </div>

      {/* same box model as Carousel > CarouselContent, minus Embla */}
      <div className="w-full overflow-hidden">
        <div className="-ml-4 flex pb-2">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="min-w-0 shrink-0 grow-0 pl-4 basis-2/3 sm:basis-1/3 lg:basis-1/5"
            >
              <Card className="p-0 gap-0 shadow-2xl dark:shadow-none overflow-hidden rounded-lg">
                <CardContent className="flex gap-3 pl-0">
                  <Skeleton className="h-19.5 w-14.5 shrink-0 rounded-sm" />
                  <div className="min-w-0 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="mt-3 h-1 w-full rounded-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ContinueWatchList() {
  const [api, setApi] = useState<CarouselApi>();
  const {
    canScrollPrev,
    canScrollNext,
    scrollPrev,
    scrollNext,
    handleKeyDown,
  } = useCarouselControl(api);
  const { items, loading, removeItem } = useContinueWatchList();

  if (loading) return <ContinueWatchListSkeleton />;
  if (items.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="mb-5 flex justify-between">
        <h2 className="font-semibold text-xl after:relative after:bg-primary after:mt-1 after:w-10 after:h-1.5 after:rounded-lg after:block">
          Continue Watching
        </h2>
        <div
          onKeyDownCapture={handleKeyDown}
          className="flex items-center gap-4"
        >
          <Button
            disabled={!canScrollPrev}
            onClick={scrollPrev}
            className="rounded-full"
            variant="outline"
            size="icon"
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            disabled={!canScrollNext}
            onClick={scrollNext}
            className="rounded-full"
            variant="outline"
            size="icon"
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
      <Carousel
        className="w-full"
        opts={{
          dragFree: true,
          duration: 20,
          slidesToScroll: 1,
          watchDrag: true,
        }}
        setApi={setApi}
      >
        <CarouselContent className="pb-2 touch-pan-y">
          {items.map((item) => (
            <CarouselItem
              className="basis-2/3 sm:basis-1/3 lg:basis-1/5"
              key={item.id}
            >
              <Card className="group/card relative p-0 gap-0 group shadow-2xl dark:shadow-none overflow-hidden rounded-lg">
                <Link
                  key={item.id}
                  href={{
                    pathname: `/dramas/${item.category_id}`,
                    query: { channel_id: item.id },
                  }}
                >
                  <CardContent className="flex gap-3 pl-0">
                    <div className="h-19.5 w-14.5 relative group-hover/card:scale-110 transition-transform duration-300">
                      <Image
                        src={item.poster}
                        alt={item.title}
                        fill
                        className="shrink-0 rounded-sm object-cover"
                        sizes="(max-width: 480px) 100vw, (max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                      <div className="absolute inset-0 group-hover/card:opacity-100 opacity-0 transition-opacity duration-300 bg-background/50">
                        <PlayIcon className="fill-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                      <h3 className="truncate text-sm font-semibold group-hover/card:text-primary">
                        {item.title}
                      </h3>
                      <div className="flex flex-col gap-2">
                        {/*<p>{(item.position / item.duration) * 100} %</p>*/}
                        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{
                              width: `${(item.position / item.duration) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute group/remove-watch-list top-1 right-1 z-10 size-7 rounded-full opacity-0 pointer-events-none transition-opacity group-hover/card:opacity-100 group-hover/card:pointer-events-auto"
                  onClick={() => removeItem(item.category_id)}
                >
                  <XIcon className="size-4 group-hover/remove-watch-list:text-red-500" />
                </Button>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
