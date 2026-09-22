"use client";

import { ChevronLeftIcon, ChevronRight, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import DramaList from "./DramaList";
import Link from "next/link";
import type { DramaListResult } from "../types";
import type { CarouselApi } from "@/components/ui/carousel";
import { useCallback, useEffect, useState } from "react";
import { useCarouselControl } from "@/hooks/useCarouselControl";

interface DramaSectionProps {
  title: string;
  data: DramaListResult;
  viewAllHref: string;
  variant: "grid" | "carousel";
}
export default function DramaSection({
  title,
  data,
  viewAllHref,
  variant,
}: DramaSectionProps) {
  const [api, setApi] = useState<CarouselApi>();
  const {
    canScrollPrev,
    canScrollNext,
    scrollPrev,
    scrollNext,
    handleKeyDown,
  } = useCarouselControl(api);

  return (
    <section className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-xl after:relative after:bg-primary after:mt-1 after:w-10 after:h-1.5 after:rounded-lg after:block">
          {title}
        </h2>
        <div className="flex items-center gap-4">
          <Button variant="link" asChild>
            <Link href={viewAllHref}>
              View All
              <ChevronRight className="size-3 ml-1" />
            </Link>
          </Button>
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
      </div>
      <DramaList data={data} variant={variant} setApi={setApi} />
    </section>
  );
}
