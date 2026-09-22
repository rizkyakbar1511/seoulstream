"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { GenreList } from "../types";
import React from "react";
import { cn } from "@/lib/utils";

interface GenreCollapsibleProps {
  genres: GenreList;
}

const MAX_DISPLAYED_GENRES = 15;

export default function GenreCollapsible({ genres }: GenreCollapsibleProps) {
  const [open, setOpen] = React.useState(false);
  const displayedGenres = genres.items.slice(0, MAX_DISPLAYED_GENRES);
  const collapsedGenres = genres.items.slice(MAX_DISPLAYED_GENRES);
  return (
    <React.Fragment>
      <div className="flex items-center gap-2 flex-wrap">
        {displayedGenres.map((genre) => (
          <Badge
            className="px-3 py-1 text-xs sm:text-sm"
            key={genre.id}
            variant="secondary"
            asChild
          >
            <Link href={`/genre/${genre.label}`}>{genre.label}</Link>
          </Badge>
        ))}
      </div>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleContent className="flex items-center gap-2 flex-wrap overflow-hidden  data-[state=open]:animate-collapsible-down    data-[state=closed]:animate-collapsible-up">
          {collapsedGenres.map((genre) => (
            <Badge
              className="px-3 py-1 text-xs md:text-sm"
              key={genre.id}
              variant="secondary"
              asChild
            >
              <Link href={`/genre/${genre.label}`}>{genre.label}</Link>
            </Badge>
          ))}
        </CollapsibleContent>
        <CollapsibleTrigger asChild>
          <Button
            className="p-0! hover:no-underline hover:cursor-pointer"
            variant="link"
          >
            {open ? "Show fewer" : `Show all ${genres.total}`}
            <ChevronDown
              className={cn(
                "transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </Button>
        </CollapsibleTrigger>
      </Collapsible>
    </React.Fragment>
  );
}
