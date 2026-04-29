"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import type { GenreList } from "../types";

interface GenreCarouselProps {
  genres: GenreList;
  currentGenre?: string;
}

export default function GenreCarousel({
  genres,
  currentGenre = "",
}: GenreCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();

  // Find active index
  const activeIndex = genres.items.findIndex(
    (genre) => genre.label.toLowerCase() === currentGenre.toLowerCase(),
  );

  useEffect(() => {
    if (!api) return;

    // Scroll to active slide
    if (activeIndex !== -1) {
      api.scrollTo(activeIndex, true);
    }
  }, [api, activeIndex]);

  return (
    <Carousel
      className="w-full"
      opts={{
        dragFree: true,
        slidesToScroll: 1,
        startIndex: activeIndex !== -1 ? activeIndex : 0,
      }}
      setApi={setApi}
    >
      <CarouselContent className="pb-2">
        {genres.items.map((genre, index) => {
          const isActive = index === activeIndex;
          return (
            <CarouselItem className="basis-1/3 md:basis-1/6" key={genre.id}>
              <Link
                className={buttonVariants({
                  variant: isActive ? "default" : "secondary",
                  className: "w-full",
                  size: "sm",
                })}
                href={`/genre/${genre.label}`}
              >
                {genre.label}
              </Link>
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}
